import { ChatCompletionRequestMessage } from "openai"


const system_msg = "You are a social media post generator function that takes a social network name and a URL\
                    as input and outputs a social media post about it with emojis and hashtags, and in European Portuguese."

const training_msgs: ChatCompletionRequestMessage[] = [
    {role: "system", content: system_msg},

    {role: "user", content: "{social network name}, {insert url here}"},
    {role: "assistant", content: "{insert post here}"},
    
]

export default defineEventHandler( 
    async event => {
        const { url, temp, socialApp } = await readBody(event)

        const completion = await $openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                ...training_msgs,
                {role: "user", content: `${socialApp}, ${url} ?`}
            ],
            temperature: Number(temp)
        })


        const response = completion.data.choices[0].message

        return response
    }
)