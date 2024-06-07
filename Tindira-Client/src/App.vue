<template>
  <!-- TODO: find alternative to min-h-dvh, it's not functioning properly -->
  <div class="dark:bg-gray-600 flex flex-col min-h-dvh h-dvh">
    <ToastService>
      <Suspense>
        <template #default>
          <StoreInitializer />
        </template>
        <template #fallback>
          <div class="flex items-center justify-center h-full">
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" />
          </div>
        </template>
      </Suspense>
      <DynamicDialog />
    </ToastService>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import ToastService from '@/components/global/ToastService.vue'
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const script = document.createElement('script')
script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  }&region=ISR&libraries=places`
document.head.appendChild(script)

const router = useRouter();

onMounted(async () => {
  await router.isReady();
});

const StoreInitializer = defineAsyncComponent(
  () => import('./components/global/StoreInitializer.vue')
)
</script>

<style scoped></style>
