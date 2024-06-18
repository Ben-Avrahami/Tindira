<template>
  <div class="flex flex-col">
    <div class="grid grid-cols-2 md:grid-cols-3 gap-x-4">
      <ListingImage
        v-for="(image, index) in images"
        :key="index"
        :image="image"
        :removeImage="() => photosManager.remove([image])"
        :editable="editable"
      />
    </div>
    <div v-if="editable" class="flex flex-col">
      <Button
        :label="'Add Photos (' + images.length + '/' + MAX_PHOTOS + ')'"
        @click="fileInput?.click() ?? (() => console.warn('fileInput is null'))"
        :disabled="images.length >= MAX_PHOTOS"
      />
      <input ref="fileInput" type="file" accept="image/*" @change="handleInput" multiple hidden />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ListingImage from './ListingImage.vue'
import * as ListingInterface from '@/interfaces/listing.interface'
import { injectToast } from '@/functions/inject'
import type { PhotosManager } from '@/functions/photosManager'
import { DEFAULT_MAX_FILE_SIZE, handleFilesUpload } from '@/functions/util'

const toast = injectToast()

const props = defineProps<{
  photosManager: PhotosManager
  username: string
  editable: boolean
}>()

const MAX_PHOTOS = ListingInterface.MAX_PICTURES
const MAX_PHOTO_SIZE = DEFAULT_MAX_FILE_SIZE

const images = computed(() => props.photosManager.get())

const fileInput = ref<HTMLInputElement | null>(null)

const handleInput = async (event: Event) => {
  const error = await handleFilesUpload(event, props.photosManager, MAX_PHOTO_SIZE, MAX_PHOTOS)

  if (error) {
    toast.add({
      severity: 'error',
      summary: 'Files upload error',
      detail: error,
      life: 3000
    })
  }
}
</script>

<style scoped></style>
