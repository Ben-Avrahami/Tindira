<template>
  <div class="flex flex-col">
    <div class="grid grid-cols-2 md:grid-cols-3 gap-x-4">
      <ListingImage
        v-for="(image, index) in images"
        :key="index"
        :image="image"
        :removeImage="() => removeImage(image)"
        :editable="editable"
      />
    </div>
    <div v-if="editable" class="flex flex-col">
      <Button
        :label="'Add Photos (' + images.length + '/' + ListingInterface.MAX_PICTURES + ')'"
        @click="fileInput?.click()"
        :disabled="images.length >= ListingInterface.MAX_PICTURES"
      />
      <input ref="fileInput" type="file" accept="image/*" @change="handleInput" multiple hidden />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ListingImage from './ListingImage.vue'
import * as ListingInterface from '@/interfaces/listing.interface'
import { injectToast } from '@/functions/inject'

const toast = injectToast()

const props = defineProps<{
  images: string[]
  addImage: (image: File) => void
  removeImage: (url: string) => void
  editable: boolean
}>()

const fileInput = ref<HTMLInputElement | null>(null)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (!files) return

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  const MAX_FILE_SIZE_MB = MAX_FILE_SIZE / 1024 / 1024

  if (files.length + props.images.length > ListingInterface.MAX_PICTURES) {
    toast.add({
      severity: 'error',
      summary: 'Too Many Photos',
      detail: `Please upload a maximum of ${ListingInterface.MAX_PICTURES} photos`,
      life: 3000
    })
    return
  }

  Array.from(files).forEach((file) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.add({
        severity: 'error',
        summary: 'File size is too large',
        detail: `Please upload a file smaller than ${MAX_FILE_SIZE_MB}MB.`,
        life: 3000
      })
    } else {
      props.addImage(file)
    }
  })
}
</script>

<style scoped></style>
