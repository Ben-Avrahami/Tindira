<template>
  <DataView :value="history" dataKey="listingId">
    <template #list="slotProps">
      <div class="grid grid-nogutter">
        <div
          v-for="(item, index) in slotProps.items"
          :key="index"
          :class="{ 'bg-green-200': props.isLike, 'bg-red-300': !props.isLike }"
          class="col-12 mb-5"
        >
          <div
            class="flex flex-col sm:flex-row sm:items-center p-4 gap-3"
            :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }"
          >
            <div class="md:w-[10rem] relative">
              <img class="block xl:block mx-auto rounded-md w-full" :src="item.images[0]" />
              <Tag
                :value="tagText"
                :severity="getSeverity"
                class="absolute"
                style="left: 4px; top: 4px"
              >
              </Tag>
            </div>
            <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-4">
              <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                <div>
                  <span class="font-medium text-secondary text-sm">{{ item.title }}</span>
                  <div class="flex items-center">
                    <icon icon="mdi:address-marker-outline"></icon>
                    <p class="drag-area m-0">{{ item.coordinates.formatted_address }}</p>
                  </div>
                  <div class="text-lg font-medium text-surface-700 dark:text-surface-0/80 mt-2">
                    {{ item.description }}
                  </div>
                </div>
              </div>
              <div class="flex flex-col md:items-end gap-5">
                <span class="text-xl font-semibold text-surface-700 dark:text-surface-0/80"
                  >{{
                    item?.isPricePerWholeTime ? item?.pricePerWholeTime : item?.pricePerMonth
                  }}
                  ₪/{{ item?.isPricePerWholeTime ? 'Whole Time' : 'Month' }}
                </span>
                <div class="flex flex-row-reverse md:flex-row gap-2">
                  <Button
                    severity="secondary"
                    text
                    rounded
                    aria-label="Info"
                    class="mr-2 text-3xl"
                    @click="showFullAptData(item)"
                  >
                    <template #icon>
                      <Icon icon="ooui:info-filled"></Icon>
                    </template>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #empty>
      <div class="flex text-center justify-center text-2xl">
        No History To Display At this Category!<br />
        What Are You Waiting For?
      </div>
    </template>
  </DataView>
</template>

<script setup lang="ts">
import type { Listing } from '@/interfaces/listing.interface'
import { useDialog } from 'primevue/usedialog'
import { computed, defineAsyncComponent, type PropType } from 'vue'
import { Icon } from '@iconify/vue'
import { useAppStore } from '../stores/app'
import API from '@/api'

const userStore = useAppStore()

const props = defineProps({
  history: {
    type: Array as PropType<Listing[]>,
    required: true
  },
  isLike: {
    type: Boolean,
    required: true
  }
})
const emit = defineEmits(['refreshHistory'])

const tagText = computed(() => (props.isLike ? 'Liked' : 'Disliked'))

const getSeverity = computed(() => (props.isLike ? 'success' : 'danger'))

const dialog = useDialog()
const ApartmentDialog = defineAsyncComponent(() => import('@/components/AptDialog.vue'))

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
          emit('refreshHistory')
        })
      }
    }
  })
}
</script>
