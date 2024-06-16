<template>
  <div class="my-4 flex flex-col items-center">
    <div class="flex flex-col gap-2 mx-auto">
      <div class="overflow-hidden rounded-xl">
        <img
          class="object-cover aspect-square w-full h-full"
          :src="image"
          alt="Listing Image Preview"
        />
      </div>
      <Button aria-label="Remove Image" @click="removeImage">Remove</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  image: string
  removeImage: () => void
}>()
</script>

<style scoped></style>
