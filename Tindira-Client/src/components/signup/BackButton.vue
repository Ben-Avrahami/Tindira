<template>
  <Button label="Back" severity="secondary" @click="onClick" />
</template>

<script setup lang="ts">
defineProps<{
  onClick: (event: Event) => void
}>()
</script>

<style scoped></style>
