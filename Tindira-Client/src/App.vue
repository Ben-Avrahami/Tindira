<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Toolbar from '@/components/Toolbar.vue'
import DynamicDialog from 'primevue/dynamicdialog';

const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
document.head.appendChild(script);


</script>

<template>
  <div class="dark:bg-gray-600 flex flex-col h-screen">
    <Toolbar />

    <main class="container mx-auto flex-1">
      <Suspense>
        <router-view />
      </Suspense>
      <Suspense>
        <DynamicDialog />
      </Suspense>
    </main>
  </div>
</template>

<style scoped></style>
