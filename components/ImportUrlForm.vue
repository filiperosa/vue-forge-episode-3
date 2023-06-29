<script lang="ts" setup>
import { Payload } from '~/types';


const url = ref('')
const temperature = ref(1)

const emit = defineEmits<{
    (event: 'submit', payload: Payload): void
}>()

// emit a submit event with the url and temperature
function submit(): void {
    if (!isValidUrl(url.value)) {
        url.value = ''
        return
    }

    const payload: Payload = {
        url: url.value,
        temperature: temperature.value
    }

    emit('submit', payload )
    url.value = ''
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url.startsWith('http://') || url.startsWith('https://') ? url : 'http://' + url);
    return true;
  } catch (_) {
    alert("Invalid URL. Please try again.")
    return false;
  }
}

</script>

<template>
    <div class="form-control mb-5">
        <div class="input-group">
            <input type="text" placeholder="Insert URL here" class="input input-bordered grow" v-model="url"/>
            <button class="btn btn-square w-fit pl-2 pr-2" @click="submit" :disabled="url == ''">GENERATE ANOUNCEMENTS</button>
        </div>
        <input type="range" min="0" max="1" step="0.1" class="range range-primary range-sm mt-1" v-model="temperature" />
        <label class="form-label text-s">Temperature: {{ temperature }}</label>
    </div>
</template>