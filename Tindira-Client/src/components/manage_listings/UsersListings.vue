<template>
  <div>
    <DataView v-if="listings !== undefined" :value="listings" dataKey="listingId">
      <template #list="slotProps">
        <div class="grid grid-nogutter">
          <div v-for="(item, index) in slotProps.items" :key="index" class="col-12 bg-red-300 mb-5">
            <UsersListing
              :index="index"
              :listing="item"
              :showFullAptData="showFullAptData"
              :showAptLikes="showAptLikes"
              :showEditAptDialog="showEditAptDialog"
            />
          </div>
        </div>
      </template>
      <template #empty>
        <div class="flex text-center justify-center text-2xl">
          You havent uploaded any listings yet!<br />
          What are you waiting for?
        </div>
      </template>
    </DataView>
  </div>
</template>

<script setup lang="ts">
import type { Listing } from '@/interfaces/listing.interface'
import { useDialog } from 'primevue/usedialog'
import { defineAsyncComponent } from 'vue'
import UsersListing from './UsersListing.vue'

defineProps<{
  listings: Listing[] | undefined
}>()

const dialog = useDialog()

const ListingLikesDialog = defineAsyncComponent(
  () => import('@/components/manage_listings/listing_likes/ListingLikesDialog.vue')
)

const showAptLikes = async (item: Listing) => {
  dialog.open(ListingLikesDialog, {
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
    }
  })
}

const ApartmentDialog = defineAsyncComponent(() => import('@/components/AptDialog.vue'))

const showFullAptData = (item: Listing) => {
  dialog.open(ApartmentDialog, {
    data: {
      listing: item,
      showLikeAndDislikeButton: false
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
    }
  })
}

const EditListingDialog = defineAsyncComponent(
  () => import('@/components/manage_listings/listing_edit/EditListingDialog.vue')
)

const showEditAptDialog = (item: Listing) => {
  dialog.open(EditListingDialog, {
    data: {
      listing: item,
      showLikeAndDislikeButton: false
    },
    props: {
      header: item.title,
      style: {
        width: '95vw'
      },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      modal: true,
      closable: true,
      draggable: false
    }
  })
}
</script>
