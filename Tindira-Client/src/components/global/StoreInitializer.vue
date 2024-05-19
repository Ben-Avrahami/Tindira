<template>
  <SiteView v-if="isAppReady" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'
import SiteView from '@/components/global/SiteView.vue'

const isAppReady = ref(false)
const appStore = useAppStore()
await appStore.initializeState()
isAppReady.value = true
</script>

<style scoped></style>
