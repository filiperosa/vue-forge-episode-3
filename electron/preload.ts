import { ChatCompletionRequestMessage } from "openai"
const { contextBridge, ipcRenderer } = require('electron')
import { Configuration, OpenAIApi } from 'openai'
import keytar from 'keytar'

// const config = useRuntimeConfig()
let openaiConfig = new Configuration({
    apiKey: process.env.NUXT_OPENAI_API_KEY,
})
delete openaiConfig.baseOptions.headers['User-Agent'];
const openai = new OpenAIApi(openaiConfig)

console.log('---- electron/preload.ts ----')

import { LANGUAGE } from "../constants"


const generate_system_msg = "You are a social media post generator function that takes a social network name and a URL" +
                    " as input and outputs a social media post about it with emojis and hashtags, and in " + LANGUAGE

const generate_training_msgs: ChatCompletionRequestMessage[] = [
    {role: "system", content: generate_system_msg},

    {role: "user", content: "{social network name}, {insert url here}"},
    {role: "assistant", content: "{insert post here}"},
]

const system_msg = "You are a prompt engineer that receives an article url," + 
                " picks of 2 or 3 physical objects related to the article, " + 
                "and then outputs one short prompt for DALL·E requesting an image containing the objects"

const training_msgs: ChatCompletionRequestMessage[] = [
    {role: "system", content: system_msg},

    {role: "user", content: "{article url}"},
    {role: "assistant", content: "Image of {main article topic/object}, and {object 2}, and {object 3}"},
    
]

contextBridge.exposeInMainWorld(
  'electron',
  {
    imagePrompt: async (url: string, temp: number) => {
        console.log("imagePrompt called")
        const completion = await openai.createChatCompletion({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        ...training_msgs,
                        {role: "user", content: `${url}`}
                    ],
                    temperature: Number(temp)
                })
        const response = completion.data.choices[0].message
        return response
    },
    generatePost: async (url: string, temp: number, socialApp: string) => {
        const completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                ...generate_training_msgs,
                {role: "user", content: `${socialApp}, ${url} ?`}
            ],
            temperature: Number(temp),
        })
        const response = completion.data.choices[0].message
        return response
    },
    generateImages: async(prompt_text: string) => {
        const response = await openai.createImage({
            prompt: prompt_text,
            n: 4,
            size: "1024x1024",
          });
          
        // return image urls
        return [response.data.data[0].url, response.data.data[1].url, response.data.data[2].url, response.data.data[3].url]
    },
  }
)