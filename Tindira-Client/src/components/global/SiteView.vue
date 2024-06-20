<template>
  <div class="flex flex-col h-full overflow-auto">
    <SiteHeader v-if="appStore.isUserConnected" />

    <main class="container flex flex-col flex-1 h-full mx-auto max-w-4xl">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :key="$route.path" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<script setup lang="ts">
import SiteHeader from '@/components/global/SiteHeader.vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
