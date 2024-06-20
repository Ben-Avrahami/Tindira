<template>
  <div>
    <div v-if="history !== undefined">
      <DataView v-if="history.length" :value="history" dataKey="listingId">
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
      </DataView>
      <div
        v-else
        class="flex flex-col items-center justify-center text-lg text-center text-surface-600 dark:text-surface-900 mx-auto px-4 max-w-xl mt-10"
      >
        <h2 class="font-bold mb-4">No Swipes Yet</h2>
        <p class="mb-4">
          It looks like your swiping history is currently empty. This is the perfect moment to start
          exploring and making connections.
        </p>
        <p>
          Ready to dive in? Click
          <RouterLink
            to="/"
            class="text-primary-500 hover:text-primary-600 transition duration-200 ease-in-out"
          >
            here
          </RouterLink>
          to begin your journey!
        </p>
      </div>
    </div>
  </div>
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
