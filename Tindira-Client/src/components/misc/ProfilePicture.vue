<template>
  <div class="flex flex-col items-center">
    <div class="relative">
      <label for="profilePicture" class="cursor-pointer">
        <Avatar :image size="2xlarge" shape="circle" class="mx-auto" />
      </label>
      <button
        v-if="!isImageEmpty"
        class="pi pi-times absolute -top-1 -left-2 text-primary-500 hover:text-primary-600"
        aria-label="Remove Profile Picture"
        @click="removeImage"
      >
        <Icon icon="mdi:times" />
      </button>
    </div>
  </div>
  <input
    ref="fileInput"
    id="profilePicture"
    type="file"
    accept="image/*"
    @change="handleInput"
    hidden
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { injectToast } from '@/functions/inject'
import type { ProfilePictureManager } from '@/functions/photosManager'
import { handleFileUpload } from '@/functions/util'
import { Icon } from '@iconify/vue/dist/iconify.js'

const props = defineProps<{
  profilePictureManager: ProfilePictureManager
  username: string
}>()

const toast = injectToast()

const fileInput = ref<HTMLInputElement | null>(null)

const isImageEmpty = computed<boolean>(() => props.profilePictureManager.isEmpty())
const image = computed<string>(() => props.profilePictureManager.get())

const removeImage = () => {
  props.profilePictureManager.reset()
}

const handleInput = async (event: Event) => {
  const error = await handleFileUpload(event, props.profilePictureManager)

  if (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error,
      life: 3000
    })
  }
}
</script>

<style scoped></style>
