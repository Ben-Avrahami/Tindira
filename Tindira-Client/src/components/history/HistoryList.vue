<template>
  <DataView :value="history" dataKey="listingId">
    <template #list="slotProps">
      <div class="grid grid-nogutter gap-5">
        <div
          v-for="(item, index) in slotProps.items"
          :key="index"
          :class="{
            'bg-green-200 dark:bg-green-800': props.isLike,
            'bg-red-300 dark:bg-red-900': !props.isLike
          }"
        >
          <HistoryListItem :listing="item" :isLike="props.isLike" :refreshHistory />
        </div>
      </div>
    </template>
    <template #empty>
      <div class="flex flex-col text-center justify-center text-2xl">
        <p>No History To Display At this Category!</p>
        <p>What Are You Waiting For?</p>
      </div>
    </template>
  </DataView>
</template>

<script setup lang="ts">
import type { Listing } from '@/interfaces/listing.interface'
import HistoryListItem from './HistoryListItem.vue'

const props = defineProps<{
  history: Listing[]
  isLike: boolean
  refreshHistory: () => void
}>()
</script>
