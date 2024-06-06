<template>
  <Button label="Next" @click="onClick" :disabled />
</template>

<script setup lang="ts">
defineProps<{
  onClick: (event: Event) => void
  disabled?: boolean
}>()
</script>

<style scoped></style>
