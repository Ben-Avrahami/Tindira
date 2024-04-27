<template>
  <!-- <Button label="Next" icon="mdi:arrow-right" @click="onClick" /> -->
  <Button label="Next" @click="onClick" :disabled />
</template>

<script setup lang="ts">
defineProps<{
  onClick: (event: Event) => void
  disabled?: boolean
}>()
</script>

<style scoped></style>
