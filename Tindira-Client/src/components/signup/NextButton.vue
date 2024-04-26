<template>
  <!-- <Button label="Next" icon="mdi:arrow-right" @click="onClick" /> -->
  <Button label="Next" @click="onClick" />
</template>

<script setup lang="ts">
defineProps<{
  onClick: (event: Event) => void
}>()
</script>

<style scoped></style>
