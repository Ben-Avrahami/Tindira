<template>
  <div class="flex flex-col sm:flex-row sm:items-center p-4 gap-3">
    <div class="md:max-w-[60%] mx-auto relative">
      <Image class="block mx-auto rounded-md w-full" :src="listing.images[0]" />
      <Tag :value="tagText" :severity="getSeverity" class="left-1 top-1 absolute" />
    </div>
    <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-4">
      <div class="flex flex-row md:flex-col justify-between items-start gap-2">
        <div>
          <span class="font-medium text-secondary text-sm">{{ listing.title }}</span>
          <div class="flex items-center">
            <Icon icon="mdi:address-marker-outline" />
            <p class="drag-area m-0">{{ listing.coordinates.formatted_address }}</p>
          </div>
          <div class="text-lg font-medium text-surface-700 dark:text-surface-0/80 mt-2">
            {{ listing.description }}
          </div>
        </div>
      </div>
      <div class="flex flex-col md:items-end gap-5">
        <span class="text-xl font-semibold text-surface-700 dark:text-surface-0/80"
          >{{
            listing.isPricePerWholeTime ? listing.pricePerWholeTime : listing.pricePerMonth
          }}
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Listing } from '@/interfaces/listing.interface'
import { useDialog } from 'primevue/usedialog'
import { computed, defineAsyncComponent } from 'vue'
import { Icon } from '@iconify/vue'
import { useAppStore } from '@/stores/app'
import API from '@/api'

const userStore = useAppStore()

const props = defineProps<{
  listing: Listing
  isLike: boolean
  refreshHistory: () => void
}>()

const tagText = computed(() => (props.isLike ? 'Liked' : 'Disliked'))

const getSeverity = computed(() => (props.isLike ? 'success' : 'danger'))

const dialog = useDialog()
const ApartmentDialog = defineAsyncComponent(
  () => import('@/components/misc/listing/ListingDialog.vue')
)

const showFullAptData = (item: any) => {
  dialog.open(ApartmentDialog, {
    data: {
      listing: item
    },
    props: {
      header: item.title,
      style: {
        width: '100vw'
      },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      modal: true,
      closable: true
    },
    onClose: async (isLike) => {
      if (isLike?.data !== undefined) {
        userStore.performAsyncAction(async () => {
          await API.tagListing(item.listingId, userStore.connectedUser!, isLike.data)
          props.refreshHistory()
        })
      }
    }
  })
}
</script>
