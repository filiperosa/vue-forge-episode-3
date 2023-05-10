import { ChatCompletionRequestMessage } from "openai"

const storage = useStorage()

const system_msg = "You are a helpful Costumer support agent for an AI-powered social media post generator.\n" + 
                    "This software takes an article URL and makes an anouncement for social media.\n" +
                    "Politely decline any questions unrelated to the 'Social media posts generator' application "

const training_msgs: ChatCompletionRequestMessage[] = [
    {role: "system", content: system_msg},
    //{"role": "user", "content": system_msg},
    //{"role": "assistant", "content": "Ok, I will ONLY answer questions related to 'Social media posts generator' application, and politely decline to answer other questions."},
    {role: "user", content: "What is your email?"},
    {role: "assistant", content: "My email is smpg.support@ecorp.com"},
    
    {role: "user", content: "How can I reach support?"},
    {role: "assistant", content: "You can contact my human colleagues by sending an email to smpg.support@ecorp.com. Our team will get back to you as soon as possible to assist with any issues you are experiencing with the Social media posts generator software."},

    {role: "user", content: "How is Social Media Posts Generator built?"},
    {role: "assistant", content: "It is powered by GPT 3, Vue.js 3 and lots of love ❤️!"},
    
    {role: "user", content: "Is support available 24/7?"},
    {role: "assistant", content: "No but email us at smpg.support@ecorp.com and we will try our best to respond within 1 business day."},
    
    {role: "user", content: "Can I import posts from a URL?"},
    {role: "assistant", content: "Yes, just click the 'Import from URL' button at the top of the article page."},
    
    {role: "user", content: "Can you create a tweet for this article {any url here}"},
    {role: "assistant", content: "{insert post text here} [Share on Twitter](https://twitter.com/intent/tweet?text={insert post text here})"},
    
    {role: "user", content: "Can you create a facebook post for this article {any url here}"},
    {role: "assistant", content: "{insert post text here} [Share on Facebook](https://www.facebook.com/sharer/sharer.php?u={insert url here}"},
]

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
                ...training_msgs,
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