<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toolbar from '@/components/Toolbar.vue'
import DynamicDialog from 'primevue/dynamicdialog'
</script>

<template>
  <div class="dark:bg-gray-600 flex flex-col h-screen">
    <Toast />
    <Toolbar />

    <main class="container mx-auto flex-1">
      <Suspense>
        <RouterView />
      </Suspense>
      <Suspense>
        <DynamicDialog />
      </Suspense>
    </main>
  </div>
</template>

<style scoped></style>
