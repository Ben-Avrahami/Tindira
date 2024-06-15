<template>
  <div class="flex flex-col items-center">
    <div class="mb-4 flex flex-col items-center">
      <div class="flex flex-col gap-2 mx-auto">
        <div class="mt-4 overflow-hidden rounded-xl max-w-48 max-h-48">
          <img
            class="object-cover aspect-[1/1] w-full h-full"
            :src="picture"
            alt="Profile Picture Preview"
          />
        </div>
        <Button aria-label="Remove Image" @click="removePicture">Remove</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  picture: string
  removePicture: () => void
}>()
</script>

<style scoped></style>
