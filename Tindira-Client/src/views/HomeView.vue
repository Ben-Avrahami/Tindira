<template>
  <div>
    <Button text rounded label="Filters" @click="showFilters()">
      <template #icon>
        <Icon icon="tabler:adjustments-alt"></Icon>
      </template>
    </Button>
    <DraggableApt />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

import { Icon } from '@iconify/vue'
import { useDialog } from 'primevue/usedialog'
import DraggableApt from '@/components/home/DraggableApt.vue'

const dialog = useDialog()
const FiltersDialog = defineAsyncComponent(() => import('@/components/FiltersDialog.vue'))

const showFilters = () => {
  dialog.open(FiltersDialog, {
    props: {
      header: 'Filters',
      style: {
        width: '95vw'
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
