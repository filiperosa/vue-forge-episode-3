<script lang="ts" setup>
import { defineProps } from 'vue'

//define props
const props = defineProps<{
    articleUrl: string
}>()

// define refs
const image_urls = ref<(string | null)[]>([])
const generating = ref<boolean>(false)
const prompt = ref<string>('')

// // add a watch for the prop articleUrl
watch(() => props.articleUrl, (newVal, oldVal) => {
    console.log(`url changed from ${oldVal} to ${newVal}`)
    generate()
})

// generate image prompt
async function generatePrompt() {
    const res = await $fetch('/api/imageprompt', {
        method: 'POST',
        body: {
            url: props.articleUrl,
            temp: 0.9
        }
    })
    prompt.value = res.content
}

// generate image
async function generateImage() {
    const res = await $fetch('/api/images', {
        method: 'POST',
        body: {
            prompt_text: prompt.value
        }
    })
    image_urls.value = res
    generating.value = false
}

async function generate(){
    generating.value = true
    prompt.value = ''

    try {
        await generatePrompt()
        await generateImage()
    } catch (e) {
        console.log("Failed to generate images")

    }
    
    generating.value = false
}

</script>

<template>
    <div class="card bg-base-100 shadow-xl border-t-2 border-primary mb-4">
        <div class="card-body">
            <h2 class="card-title">Generated Images</h2>
            <AppLoading v-if="generating"/>
            <p>{{ prompt }}</p>
            <div class="images grid grid-cols-2">
                <figure v-for="image in image_urls" v-if="image_urls.length && !generating" class="px-10 pt-10">
                    <img :src="image || ''" alt="image" class="rounded-xl" />
                    
                </figure>
            </div>

            <div class="card-actions justify-between items-end">
                &nbsp;
                <div class="actions">
                    <button class="btn" :disabled="articleUrl == ''" @click="generate()">REGENERATE</button>
                </div>
            </div>
        </div>
    </div>
</template>