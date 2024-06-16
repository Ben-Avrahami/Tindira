<template>
  <Carousel :items-to-show="1" wrapAround>
    <Slide v-for="(image, index) in images" :key="index">
      <div class="flex max-w-96 max-h-96">
        <Image class="flex object-contain" alt="Apartment image" :src="image" preview />
      </div>
    </Slide>
    <template #addons>
      <Navigation />
      <Pagination />
    </template>
  </Carousel>
</template>

<script setup lang="ts">
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

defineProps<{
  images: string[]
}>()
</script>
