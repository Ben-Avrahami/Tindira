<template>
  <div class="about">
    <p class="text-3xl font-bold underline text-orange-600">
      Hello world!!!!!!@
    </p>
    <Button @click="console.log('clicked')">
      <iconify-icon icon="mdi:home" class="mr-4"></iconify-icon>
      <span class="animate-bounce">test if dark mode persists</span>
    </Button>
    <iconify-icon icon="ph:heart-fill"></iconify-icon>
  </div>



</template>
<script setup lang="ts">
import Button from 'primevue/Button';
</script>
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
