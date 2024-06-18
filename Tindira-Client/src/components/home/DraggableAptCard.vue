<template>
  <Card class="w-4/5 mx-auto" @dblclick="showFullAptData">
    <template #header>
      <div>
        <ImageCarousel :key="rerenderer" :images="listing.images" />
      </div>
    </template>

    <template #title>
      <div class="drag-area">
        {{ listing.title }}
      </div>
    </template>
    <template #subtitle>
      <div class="flex items-center">
        <icon icon="mdi:address-marker-outline"></icon>
        <p class="drag-area m-0 text-slate-400">
          {{ listing.coordinates.formatted_address }}
        </p>
      </div>
      <div class="flex justify-between items-center">
        <div class="drag-area title flex-grow">Full information</div>
        <Button
          severity="secondary"
          text
          rounded
          aria-label="Info"
          class="mr-2 text-3xl"
          @click="showFullAptData"
        >
          <template #icon>
            <Icon icon="ooui:info-filled"></Icon>
          </template>
        </Button>
      </div>
    </template>
    <template #content>
      <p class="drag-area m-0">{{ listing.description }}</p>
    </template>
    <template #footer>
      <div class="mx-auto space-x-24 flex justify-center">
        <Button severity="secondary" rounded aria-label="Like" @click="swipe(false)">
          <template #icon>
            <Icon icon="mdi:times"></Icon>
          </template>
        </Button>

        <Button class="text-rose-700" rounded aria-label="Like" @click="swipe(true)">
          <template #icon>
            <Icon icon="ph:heart"></Icon>
          </template>
        </Button>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import { Icon } from '@iconify/vue'
import ImageCarousel from '@/components/misc/ImageCarousel.vue'
import { useDialog } from 'primevue/usedialog'

import type { Listing } from '@/interfaces/listing.interface'

const props = defineProps<{
  listing: Listing
  swipe: (isLike: boolean) => void
}>()

const rerenderer = ref(0)

const dialog = useDialog()
const ListingDialog = defineAsyncComponent(
  () => import('@/components/misc/listing/ListingDialog.vue')
)

const showFullAptData = () => {
  dialog.open(ListingDialog, {
    data: {
      listing: props.listing
    },
    props: {
      header: props.listing.title,
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
    },
    onClose: (isLike) => {
      if (isLike?.data !== undefined) {
        setTimeout(() => {
          props.swipe(isLike.data)
        }, 500)
      }
    }
  })
}
</script>

<style scoped>
.animate-right {
  animation: swipeRight 0.8s ease-out;
}

@keyframes swipeRight {
  0% {
    transform: translateX(0);
    opacity: 1;
  }

  100% {
    transform: translateX(100%) translateY(-20%) rotate(20deg);
    opacity: 0;
  }
}

.animate-left {
  animation: swipeLeft 0.8s ease-out;
}

@keyframes swipeLeft {
  0% {
    transform: translateX(0);
    opacity: 1;
  }

  100% {
    transform: translateX(-100%) translateY(-20%) rotate(-20deg);
    opacity: 0;
  }
}
</style>
