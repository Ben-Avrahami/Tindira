<template>
  <Button
    class="flex flex-col aspect-[4/3] items-center justify-center border-hidden"
    :class="[
      {
        'bg-primary-500 dark:bg-primary-500 hover:bg-primary-600': selected,
        'bg-surface-500 dark:bg-surface-500 hover:bg-surface-600': !selected
      }
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
  selected: boolean
  toggleRole: () => void
}>()
</script>

<style scoped></style>
