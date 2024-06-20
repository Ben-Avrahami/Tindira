<template>
  <div class="flex flex-col justify-center h-full w-[95%] mx-auto">
    <div class="flex flex-col text-center justify-center">
      <h1 class="text-6xl font-bold text-gray-800">500</h1>
      <p class="mt-2 text-xl font-semibold text-gray-600">Server Error</p>
      <p class="mt-4 text-gray-600">
        The server encountered an error and could not complete the request.
      </p>
      <div>
        <Button label="Refresh Page" @click="refresh" class="mt-6" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const refresh = () => window.location.reload()
</script>
