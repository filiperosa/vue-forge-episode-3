<script lang="ts" setup>
import { Payload, SocialPlatform } from '~/types'

const tweet = ref('')
const fbpost = ref('')
const ldpost = ref('')
const igpost = ref('')

const articleUrl = ref('')
const temperature = ref(1)

const GENERATE_TIMEOUT = 20

// catch emitted submit event from ImportUrlForm
const onSubmit = (payload: Payload) => {
    articleUrl.value = payload.url
    temperature.value = payload.temperature

    // generate the according posts
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
  <h1 class="text-4xl my-10">Social Media Post Generator</h1>
  <!-- ImportUrlForm Here -->

  <div class="ml-5 mr-5">
    <ImportUrlForm @submit="onSubmit" />
    <SocialAppCard title="Twitter" :post="tweet" />
    <SocialAppCard title="Facebook" :post="fbpost" :article-url="articleUrl"/>
    <SocialAppCard title="LinkedIn" :post="ldpost" :article-url="articleUrl"/>
    <SocialAppCard title="Instagram" :post="igpost" />
    <!-- Images Card Here -->
  </div>
</template>
