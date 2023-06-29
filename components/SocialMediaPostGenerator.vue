<script lang="ts" setup>
import { Payload, SocialPlatform } from '~/types'
// import { APP_NAME } from '~/constants'

import { useToast } from 'vue-toastification'
const toast = useToast()

// create refs for the posts and their regenerators
const tweet = ref('')
const tweetRegen = () => generatePost("Twitter", tweet)

const fbpost = ref('')
const fbRegen = () => generatePost("Facebook", fbpost)

const ldpost = ref('')
const ldRegen = () => generatePost("LinkedIn", ldpost)

const igpost = ref('')
const igRegen = () => generatePost("Instagram", igpost)

const articleUrl = ref('')
const temperature = ref(1)

const GENERATE_TIMEOUT = 20

// catch emitted submit event from ImportUrlForm
const onSubmit = (payload: Payload) => {
    articleUrl.value = payload.url
    temperature.value = payload.temperature

    // generate the according posts
    toast.info('Generating posts')
    generatePost("Twitter", tweet)
    generatePost("Facebook", fbpost)
    generatePost("LinkedIn", ldpost)
    generatePost("Instagram", igpost)
}

function timeout(seconds: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Timeout exceeded'));
    }, seconds * 1000);
  });
}

async function generatePost(socialApp: SocialPlatform, post: Ref<string>) {
    post.value = "Loading"

    try {
        const res = await Promise.race([
            $fetch('/api/generate', {
            method: 'POST',
            body: {
                url: articleUrl.value,
                temp: temperature.value,
                socialApp: socialApp
                }
            })
            ,
            timeout(GENERATE_TIMEOUT)
        ])
        
        post.value = res.content

    } catch (e) {
        post.value = "Failed to generate post"
    }
}



</script>

<template>
  <!-- <div class="title-bar flex justify-between items-center">
    <h1 class="text-4xl my-10">{{ APP_NAME }}</h1>
    <Settings />
  </div> -->

  <div class="ml-5 mr-5 pt-3">
    <ImportUrlForm @submit="onSubmit" />
    <SocialAppCard title="Twitter" :post="tweet" :regenerate="tweetRegen"/>
    <SocialAppCard title="Facebook" :post="fbpost" :article-url="articleUrl" :regenerate="fbRegen"/>
    <SocialAppCard title="LinkedIn" :post="ldpost" :article-url="articleUrl" :regenerate="ldRegen"/>
    <SocialAppCard title="Instagram" :post="igpost" :regenerate="igRegen"/>
    <ImageCard :article-url="articleUrl" />
  </div>
</template>
