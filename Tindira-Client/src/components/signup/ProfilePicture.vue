<template>
  <div class="flex flex-col items-center">
    <label
      v-if="!profilePicture"
      for="profile-picture"
      class="cursor-pointer aspect-[1/1] min-w-24 min-h-24 max-w-72 max-h-72 rounded-full"
    >
      <div class="flex flex-col items-center justify-center h-full">
        <Icon
          icon="mdi:cloud-upload"
          class="w-16 h-16 m-8 sm:m-16 lg:m-24 transition-transform duration-500 ease-in-out transform hover:scale-[1.1]"
        />
      </div>
    </label>
    <div v-else class="flex flex-col items-center">
      <div class="mt-4 overflow-hidden rounded-full max-w-72 max-h-72">
        <img
          class="object-cover aspect-[1/1] w-full h-full"
          :src="profilePicture"
          alt="Profile Picture Preview"
        />
      </div>
      <div class="flex flex-row items-center justify-center gap-2 mt-4">
        <Button aria-label="Replace Image" @click="replaceImage"> Replace </Button>
        <Button aria-label="Remove Image" @click="removeImage"> Remove </Button>
      </div>
    </div>
    <input
      ref="fileInput"
      id="profile-picture"
      type="file"
      accept="image/*"
      @change="handleFileUpload"
      hidden
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { injectToast } from '@/functions/inject'

const props = defineProps<{
  profilePicture: string | null
  setProfilePicture: (file: File) => void
  clearProfilePicture: () => void
}>()

const toast = injectToast()

const fileInput = ref<HTMLInputElement | null>(null)

const replaceImage = () => {
  fileInput.value?.click()
}

const removeImage = () => {
  props.clearProfilePicture()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  const MAX_FILE_SIZE_MB = MAX_FILE_SIZE / 1024 / 1024
  if (file.size > MAX_FILE_SIZE) {
    toast.add({
      severity: 'error',
      summary: 'File size is too large',
      detail: `Please upload a file smaller than ${MAX_FILE_SIZE_MB}MB.`,
      life: 3000
    })
    return
  }

  props.setProfilePicture(file)
}
</script>

<style scoped></style>
