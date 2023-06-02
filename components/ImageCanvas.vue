<script lang="ts" setup>

// define props
const props = defineProps<{
    title: string
    image: string
}>()


</script>

<template>
    <figure class="px-10 pt-10">
        <img :src="image || ''" alt="image" class="rounded-xl" />          
    </figure>
</template>