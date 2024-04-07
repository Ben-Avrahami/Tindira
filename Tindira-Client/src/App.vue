<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Toolbar from '@/components/Toolbar.vue'

</script>

<template>

  <Toolbar />

  <main class="container mx-auto">
    <router-view />
  </main>

</template>

<style scoped></style>
