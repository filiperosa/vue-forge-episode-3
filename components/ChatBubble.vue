<script lang="ts" setup>
import {Message, User} from '~~/types'
import Markdown from 'vue3-markdown-it'

const props = defineProps<{
    user?: User
    message?: Message
    isMine?: boolean
}>()

const relativeTime = useTimeAgo(() => props.message?.createdAt ?? new Date())
</script>

<template>
    <div class="chat" :class="{'chat-end': isMine, 'chat-start': !isMine}">
        <div class="chat-image avatar">
            <div class="w-10 rounded-full">
                <img :src="user?.avatar" />
            </div>
        </div>

        <div class="chat-header text-xs opacity-50 mb-2">
            <strong class="">{{ user?.name }}</strong>
            &nbsp;
            <time v-if="message">{{ relativeTime }}</time>
        </div>

        <div class="chat-bubble bg-white dark:bg-gray-900 max-w-max w-full prose-sm py-0 dark:text-white text-gray-900">
            <Markdown v-if="message" :source="message.text" class="w-full" />
            <slot v-else /> 
        </div>
    </div>
</template>