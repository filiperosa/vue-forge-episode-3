import { ChatCompletionRequestMessage } from "openai"


const system_msg = "You are a function that receives an article url as input," + 
                " picks of 2 or 3 physical objects related to the article, " + 
                "and then outputs one short prompt for DALL·E requesting an image containing the objects"

const training_msgs: ChatCompletionRequestMessage[] = [
    {role: "system", content: system_msg},

    {role: "user", content: "{article url}"},
    {role: "assistant", content: "Image of {main article topic/object}, and {object 2}, and {object 3}, without any text"},
    
]

export default defineEventHandler( 
    async event => {
        const { url, temp } = await readBody(event)

        const completion = await $openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                ...training_msgs,
                {role: "user", content: `${url}`}
            ],
            temperature: Number(temp)
        })


        const response = completion.data.choices[0].message

        return response
    }
)