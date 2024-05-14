<template>
  <SiteView v-if="isAppReady" />
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import { useAppStore } from '@/stores/app'
import SiteView from '@/components/global/SiteView.vue'

const isAppReady = ref(false)
const appStore = useAppStore()
await appStore.initializeState()
isAppReady.value = true

provide('appStore', appStore)
</script>

<style scoped></style>
