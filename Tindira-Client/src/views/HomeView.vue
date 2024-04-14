<template>
  <main>
    <AptCard />
  </main>
</template>

<script setup lang="ts">
import { useAppStore } from '../stores/app'
import { ref } from 'vue'
const userStore = useAppStore()
import AptCard from '@/components/AptCard.vue'
</script>
