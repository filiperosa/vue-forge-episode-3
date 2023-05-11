<script lang="ts" setup>

const url = ref('')

const emit = defineEmits<{
    (event: 'importUrl', url: string): void
}>()

</script>

<template>
    <div class="form-control mb-5">
        <div class="input-group">
            <input type="text" placeholder="Insert URL here" class="input input-bordered grow" v-model="url"/>
            <button class="btn btn-square w-fit pl-2 pr-2" @click="" :disabled="url == ''">GENERATE ANOUNCEMENTS</button>
        </div>
    </div>
</template>