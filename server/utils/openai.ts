import { Configuration, OpenAIApi } from 'openai'
// import keytar from 'keytar'

const config = useRuntimeConfig()
// const key = '';

// async function getKey(): Promise<string | null> {
//     try {
//       const password = await keytar.getPassword('service-name', 'account-name');
//       return password;
//     } catch (error) {
//       console.error('Error retrieving password:', error);
//       return null;
//     }
// }

// (async () => {
//     const key = await getKey();
//     console.log('Retrieved password:', key);
// })();

let openaiConfig = new Configuration({
    apiKey: config.openai.apiKey,
})

// const keytar = require("keytar");
// const secret = keytar.getPassword('KeytarTest', 'AccountName')
// secret.then((result) => {
//     console.log("result: "+ result); // result will be 'secret'
// });


export const $openai = new OpenAIApi(openaiConfig)