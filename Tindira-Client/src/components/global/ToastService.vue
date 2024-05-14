<template>
  <Toast />
  <slot />
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { provide } from 'vue'

const toast = useToast()

provide('toast', toast)
</script>
