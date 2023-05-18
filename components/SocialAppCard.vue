<script lang="ts" setup>
import { defineProps } from 'vue'
import { SocialPlatform } from '~/types'
import Markdown from 'vue3-markdown-it'

//define props
const props = defineProps<{
    title: SocialPlatform
    post?: string
    articleUrl?: string
}>()

const characterCount = computed(() => {
    return props.post?.length ?? 0
})

function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text)
    .then(() => {
      console.log("Text copied to clipboard: " + text);
    })
    .catch((error) => {
      console.error("Failed to copy text to clipboard:", error);
    });
}

const shareUrl = computed(() => {
    // generate the according share url
    switch (props.title){
        case "Facebook":
            return `https://www.facebook.com/sharer/sharer.php?u=${props.articleUrl}`
        case "Twitter":
            return `https://twitter.com/intent/tweet?text=${props.post}`
        case "LinkedIn":
            return `https://www.linkedin.com/sharing/share-offsite/?url=${props.articleUrl}`
        case "Instagram":
            return `https://www.instagram.com/#`
    }
})

function share(): void {
    // copy post to clipboard
    if (props.title != "Twitter"){
        copyToClipboard(props.post ?? '')
    }

    console.log(`Opening ${shareUrl.value}`)

    // open the share url in a new tab
    window.open(shareUrl.value, '_blank')
}

</script>

<template>
    <div class="card bg-base-100 shadow-xl border-t-2 border-primary mb-4">
        <div class="card-body">
            <h2 class="card-title">{{ title }}</h2>
            <p><Markdown :source="post" /></p>
            <div class="card-actions justify-between items-end">
            <div class="text-sm" v-if="post?.length">Character count: {{ post?.length || '' }}</div>
            &nbsp;
            <button class="btn btn-primary" :disabled="post == ''" @click="share">POST</button>
            </div>
        </div>
    </div>
</template>