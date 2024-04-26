<template>
  <main>
    <Button text rounded label="Filters" @click="showFilters()">
      <template #icon>
        <Icon icon="tabler:adjustments-alt"></Icon>
      </template>
    </Button>
    <AptCard />
  </main>
</template>

<script setup lang="ts">
import { useAppStore } from '../stores/app'
import { defineAsyncComponent, ref, watch } from 'vue'
const userStore = useAppStore()
import AptCard from '@/components/AptCard.vue'
import { Icon } from '@iconify/vue'
import { useDialog } from 'primevue/usedialog'

await userStore.initializeState()

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

const categoryOptions = ref(['sublet', 'rent', 'animel sublet', 'switch', 'buy'])

const selectedCategory = ref('sublet')
</script>
