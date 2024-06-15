<template>
  <div class="flex flex-col justify-center h-full w-[95%] mx-auto">
    <div class="flex flex-col text-center justify-center">
      <h1 class="text-6xl font-bold text-gray-800">404</h1>
      <p class="mt-2 text-xl font-semibold text-gray-600">Page Not Found</p>
      <p class="mt-4 text-gray-600">
        The page you are looking for does not exist or has been moved.
      </p>
      <div>
        <Button label="Go Back Home" @click="goBackHome" class="mt-6" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBackHome = () => {
  router.push('/')
}
</script>

<style scoped></style>
