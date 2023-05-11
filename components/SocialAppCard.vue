<script lang="ts" setup>
import { defineProps } from 'vue'
import { SocialPlatform } from '~/types'
import Markdown from 'vue3-markdown-it'

//define props
const props = defineProps<{
    title: SocialPlatform
    post?: string
}>()

const characterCount = computed(() => {
    return props.post?.length ?? 0
})

const shareUrl = computed(() => {
    // generate the according share url
    switch (props.title){
        case "Facebook":
            return "a"
        case "Twitter":
            return `https://twitter.com/intent/tweet?text=${props.post}`
        case "LinkedIn":
            return "c"
    }
})

</script>

<template>
    <div class="card bg-base-100 shadow-xl border-t-2 border-primary mb-4">
        <div class="card-body">
            <h2 class="card-title">{{ title }}</h2>
            <p><Markdown :source="post" /></p>
            <div class="card-actions justify-between items-end">
            <div class="text-sm" v-if="post?.length">Character count: {{ post?.length || '' }}</div>
            &nbsp;
            <button class="btn btn-primary" :disabled="post == ''">POST</button>
            </div>
        </div>
    </div>
</template>