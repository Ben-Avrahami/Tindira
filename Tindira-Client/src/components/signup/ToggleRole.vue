<template>
  <Button
    class="flex flex-col aspect-[3/2] items-center justify-center border-transparent hover:border-transparent"
    :class="[
      { 'bg-primary-500 hover:bg-primary-600': role, 'bg-surface-500 hover:bg-surface-600': !role }
    ]"
    @click="toggleRole"
  >
    <Icon :icon class="w-16 h-16 m-2" />
    <p>{{ description }}</p>
  </Button>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  icon: string
  description: string
  role: boolean
  toggleRole: () => void
}>()
</script>

<style scoped></style>
