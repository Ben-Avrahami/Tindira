<template>
  <div class="text-center my-3 text-xl font-semibold">{{ title }}</div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<style scoped></style>
