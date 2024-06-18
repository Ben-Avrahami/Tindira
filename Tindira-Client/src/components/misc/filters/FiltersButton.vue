<template>
  <Button text rounded label="Filters" @click="showFilters()">
    <template #icon>
      <Icon icon="tabler:adjustments-alt"></Icon>
    </template>
  </Button>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useDialog } from 'primevue/usedialog'

import { Icon } from '@iconify/vue'

const dialog = useDialog()
const FiltersForm = defineAsyncComponent(() => import('@/components/misc/filters/FiltersForm.vue'))

const showFilters = () => {
  dialog.open(FiltersForm, {
    props: {
      header: 'Filters',
      style: {
        width: '100%',
        maxWidth: '896px' // max-w-4xl
      },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      modal: true,
      closable: true
    }
  })
}
</script>

<style scoped></style>
