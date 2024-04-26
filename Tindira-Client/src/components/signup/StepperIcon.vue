<template>
  <button class="bg-transparent border-none inline-flex flex-column gap-2" @click="onClick">
    <span
      :class="[
        'w-3rem h-3rem inline-flex align-items-center justify-content-center',
        { 'text-primary-400': colorize, 'surface-border': !colorize }
      ]"
    >
      <Icon :icon="icon" />
    </span>
  </button>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  icon: string
  colorize: boolean
  onClick: (event: Event) => void
}>()
</script>

<style scoped></style>
