//const storage = useStorage()

export default defineEventHandler( 
    async event => {
        const { message } = await readBody(event)
        const session = await useSession(event, {password: "dngslkdgnfklsdngvklsdnfpsld34324b23m42-34c2gkfs"} )
        console.log("Session.id=" + session.id)
        console.log("Session.data=" + session.data)

        //const key = session.id + ':messages'
        const messages = session.data.messages || []
        console.log({messages})

        messages.push({"role": "user", "content": message})

        const data = await $openai.createChatCompletion({
            model: 'gpt-3.5-turbo', 
            messages: [
                {"role": "system", "content": "You are a helpful assistant for an AI-powered social media post generator."},
                ...messages
            ]
        })

        const response = data.data.choices[0].message
        messages.push({"role": "assistent", "content": response?.content})

        await session.update({messages})
        //await storage.setItem(key, messages)
        return response
    }
)