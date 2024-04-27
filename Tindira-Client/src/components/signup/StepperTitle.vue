<template>
  <div class="text-center my-3 text-xl font-semibold">
    {{ title }}
    <span v-if="optional" class="text-surface-300"> (optional)</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  optional?: boolean
}>()
</script>

<style scoped></style>
