import { ChatCompletionRequestMessage } from "openai"
import { ApiMessage } from "~/types"

const storage = useStorage()

export default defineEventHandler( 
    async event => {
        const { message } = await readBody(event)
        const session = await useSession(event, {password: "dngslkdgnfklsdngvklsdnfpsld34324b23m42-34c2gkfs!"} )
        console.log("Session.id=" + session.id)

        const key = session.id + ':messages'
        const messages = (await storage.getItem (key)) as ChatCompletionRequestMessage[] || []
        console.log({messages})

        messages.push({"role": "user", "content": message})

        const completion = await $openai.createChatCompletion({
            model: 'gpt-3.5-turbo', 
            messages: [
                {"role": "system", "content": "You are a helpful assistant for an AI-powered social media post generator."},
                ...messages
            ]
        })

        const response = completion.data.choices[0].message
        messages.push({"role": "assistant", "content": response?.content || ''})

        //await session.update({messages})
        await storage.setItem(key, messages)
        return response
    }
)