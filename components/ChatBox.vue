
<script lang="ts" setup>
import {Message, User} from '~~/types'
import { nanoid } from 'nanoid'
import AppLoading from './AppLoading.vue'

const props = defineProps<{
  messages: Message[]
  users: User[]
  me: User
  usersTyping?: User[]
}>()

const isOpen = ref(false)


function getUser(userId: string) {
  return props.users.find(
    user => user.id === userId
  )
}

// Logic to add a new message

const textMessage = ref('')

const emit = defineEmits<{
  (event: 'newMessage', newMessage: Message): void
}>()

function sendMessage(){
  emit('newMessage', {
    id: nanoid(),
    userId: props.me.id,
    createdAt: new Date(),
    text: textMessage.value,
  })

  textMessage.value = ''
}

// Scroll to bottom when a new message is added
// We watch the messages.length, if it changes we scroll the height of messageBox
// 
const messageBox = ref<HTMLElement>()
watch(() => props.messages.length, 
  async () => {
    await nextTick()
    if (messageBox.value) {
      messageBox.value.scrollTop = messageBox.value.scrollHeight
    }
  }
)

// Users Typing
const usersTypingText = computed(() => {
  const uniqueUsers = [...new Set(props.usersTyping?.map(user => user.name))]
  if (uniqueUsers.length == 1){
    return `${uniqueUsers[0]} is typing...`
  }
  else if (uniqueUsers.length > 1){
    return `${uniqueUsers.join(', ')} are typing...`
  }
})
</script>

<template>
  <!-- Code out the chatbox for Exercise 1 here -->
  <div class="fixed bottom-[10px] right-[10px]">
    <button 
      class="bg-blue-500 p-3 rounded-[50%]" 
      @click="isOpen = true"
      v-show="!isOpen"
    >
      <IconChat class="w-8 h-8 text-white" />
    </button>

    <div class="box w-[450px] bg-gray-300 dark:bg-gray-800 rounded" v-if="isOpen">
      <header class="bg-gray-200 dark:bg-gray-900 px-4 flex justify-between items-center">
        Costumer Support Chat
        <button class="p-4 pr-0" @click="isOpen = false">
          <!-- Icon chevron-down from heroicons -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </header>

      <div ref="messageBox" class="messages p-4 overflow-y-scroll max-h-[80vh]">
        <ChatBubble 
          v-for="message in messages"
          :key="message.id"
          :user="getUser(message.userId)"
          :message="message"
          :is-mine="me.id === message.userId"
        />

        <ChatBubble
          v-for="user in usersTyping"
          :user="user"
        >
          <AppLoading />
        </ChatBubble>
      </div>

      <footer class="p-2">

        <div class="h-6 px-2 text-sm italic" v-if="usersTyping.length">{{ usersTypingText }}</div>

        <input 
          type="text" 
          class="input w-full block" 
          placeholder="Type your message" 
          v-model="textMessage"
          @keypress.enter.exact.prevent="sendMessage"
        />
      </footer>
    </div>
  </div>
</template>