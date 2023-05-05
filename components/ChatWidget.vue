<script setup lang="ts">
import { nanoid } from "nanoid";
import { Message, User } from "~~/types";

const me = ref<User>({
  id: "user",
  avatar: "/avatar.jpg",
  name: "You",
});
const bot = ref<User>({
  id: "assistant",
  avatar: "/bot.jpg",
  name: "Botman",
});

const users = computed(() => [me.value, bot.value]);

const messages = ref<Message[]>([]);
const usersTyping = ref<User[]>([]);

// Text ChatGPT
async function handleNewMessage(message: Message) {
  messages.value.push(message);
  usersTyping.value.push(bot.value)

  try{
    // Send the message to the ChatGPT API
    const res = await $fetch('/api/ai', {
      method: 'POST',
      body: {
        message: message.text
      }
    })

    // Push the AI response to the messages array
    messages.value.push({
      id: nanoid(),
      createdAt: new Date(),
      text: res.content,
      userId: "assistant",
    });
  } 
  catch (e) {
    messages.value.push({
      id: nanoid(),
      createdAt: new Date(),
      text: "Sorry, I'm having trouble getting a response",
      userId: "assistant",
    });
  }

  usersTyping.value = [];
}
</script>
<template>
  <ChatBox
    :me="me"
    :users="users"
    :messages="messages"
    @new-message="handleNewMessage"
    :usersTyping="usersTyping"
  />
</template>
