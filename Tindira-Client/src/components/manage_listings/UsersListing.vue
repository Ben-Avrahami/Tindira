<template>
  <div
    class="flex flex-col sm:flex-row sm:items-center p-4 gap-3 bg-red-300 dark:bg-red-900"
    @dblclick="() => showFullAptData(listing)"
  >
    <div class="md:w-[10rem] relative">
      <img class="block xl:block mx-auto rounded-md w-full" :src="listing.images[0]" />
    </div>
    <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-4">
      <div class="flex flex-row md:flex-col justify-between items-start gap-2">
        <div>
          <span class="font-medium text-secondary text-sm">{{ listing.title }}</span>
          <div class="flex items-center">
            <icon icon="mdi:address-marker-outline"></icon>
            <p class="drag-area m-0">{{ listing.coordinates?.formatted_address }}</p>
          </div>
          <div class="text-lg font-medium text-surface-700 dark:text-surface-0/80 mt-2">
            {{ listing.description }}
          </div>
        </div>
      </div>
      <div class="flex flex-col md:items-end gap-5">
        <span class="text-xl font-semibold text-surface-700 dark:text-surface-0/80">
          {{ listing.isPricePerWholeTime ? listing.pricePerWholeTime : listing.pricePerMonth }}
          ₪/{{ listing.isPricePerWholeTime ? 'Whole Time' : 'Month' }}
        </span>
        <div class="flex flex-row-reverse md:flex-row gap-2">
          <Button
            severity="secondary"
            text
            rounded
            aria-label="Info"
            class="mr-2 text-3xl"
            @click="showFullAptData(listing)"
          >
            <template #icon>
              <Icon icon="ooui:info-filled"></Icon>
            </template>
          </Button>

          <Button
            severity="secondary"
            text
            rounded
            aria-label="Info"
            class="mr-2 text-3xl"
            @click="showAptLikes(listing)"
          >
            <template #icon>
              <Icon icon="hugeicons:user-love-02"></Icon>
            </template>
          </Button>

          <Button
            severity="secondary"
            text
            rounded
            aria-label="Info"
            class="mr-2 text-3xl"
            @click="showEditAptDialog(listing)"
          >
            <template #icon>
              <Icon icon="mdi:pencil"></Icon>
            </template>
          </Button>

          <Button
            severity="secondary"
            text
            rounded
            aria-label="Info"
            class="mr-2 text-3xl"
            @click="showConfirmDeleteDialog(listing)"
          >
            <template #icon>
              <Icon icon="mdi:delete"></Icon>
            </template>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Listing } from '@/interfaces/listing.interface'
import { Icon } from '@iconify/vue'

defineProps<{
  listing: Listing
  showFullAptData: (listing: Listing) => void
  showAptLikes: (listing: Listing) => Promise<void>
  showEditAptDialog: (listing: Listing) => void
  showConfirmDeleteDialog: (listing: Listing) => void
}>()
</script>
