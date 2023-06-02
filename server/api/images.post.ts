export default defineEventHandler( 
    async event => {
        const { prompt_text } = await readBody(event)
        
        const response = await $openai.createImage({
            prompt: prompt_text,
            n: 4,
            size: "1024x1024",
          });
          
        // return image urls
        return [response.data.data[0].url, response.data.data[1].url, response.data.data[2].url, response.data.data[3].url]
    }
)