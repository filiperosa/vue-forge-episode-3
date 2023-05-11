<script lang="ts" setup>

const tweet = ref("Just in: @virgingalactic successfully completes crewed flight of Unity 25. Space tourism is one step closer to reality! 🚀🪐 #VirginGalactic #CrewedFlight #SpaceTourism")
const fbpost = ref('')
const ldpost = ref('')

</script>

<template>
  <h1 class="text-4xl my-10">Social Media Post Generator</h1>
  <!-- ImportUrlForm Here -->

  <div class="ml-5 mr-5">
    <ImportUrlForm />
    <SocialAppCard title="Twitter" :post="tweet" />
    <SocialAppCard title="Facebook" :post="fbpost" />
    <SocialAppCard title="LinkedIn" :post="ldpost" />
    <!-- Images Card Here -->
  </div>
</template>
