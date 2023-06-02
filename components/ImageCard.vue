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

const imageStyle = ref<string>('Pick the desired style')
const pattern = ref<boolean>(false)

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
            temp: 0.8
        }
    })
    prompt.value = res.content
}

// generate image
async function generateImage() {
    prompt.value += " Without any text"
    prompt.value += pattern.value ? ', display objects repeatedly forming a pattern' : ''
    prompt.value += !imageStyle.value.startsWith("Pick") ? `, ${imageStyle.value.toLowerCase()}` : ''

    const res = await $fetch('/api/images', {
        method: 'POST',
        body: {
            prompt_text: prompt.value,
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
        <div class="card-header flex justify-between p-[2rem] pt-[1rem]">
            <h2 class="card-title">Generated Images</h2>

            <div class="generate-options flex justify-end mt-2">
                <select v-model="imageStyle" class="select select-primary mr-3">
                    <option disabled selected>Pick the desired style</option>
                    <option>Realistic</option>
                    <option>Cartoon</option>
                    <option>Hand drawn</option>
                    <option>Digital art</option>
                </select>
                <label class="swap border-gray-400 border-2 pr-2 rounded-md">
                    <input type="checkbox" v-model="pattern"/>
                    <div class="swap-on flex flex-row items-center"><PatternIcon class="h-9"/>&nbsp;<a>Pattern ON</a></div>
                    <div class="swap-off flex flex-row items-center"><NoPatternIcon class="h-9"/>&nbsp;<a>Pattern OFF</a></div>
                </label>
            </div>
        </div>
        <div class="card-body">
            <!-- <div class="style"> TODO: Add a style dropdown/selector (-/realistic/cartoon/handrawn) and a radio buttun for 'pattern' </div>-->

            <AppLoading v-if="generating"/>
            <p>{{ prompt }}</p>
            <div class="images grid grid-cols-2">
                <ImageCanvas v-for="image in image_urls" v-if="image_urls.length && !generating" :image="image || ''" :title="``" />
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