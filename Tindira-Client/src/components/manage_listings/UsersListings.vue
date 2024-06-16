<template>
  <div>
    <DataView v-if="listings !== undefined" :value="listings" dataKey="listingId">
      <template #list="slotProps">
        <div class="grid grid-nogutter gap-5">
          <div v-for="(item, index) in slotProps.items" :key="index">
            <UsersListing
              :listing="item"
              :showFullAptData="showFullAptData"
              :showAptLikes="showAptLikes"
              :showEditAptDialog="showEditAptDialog"
              :showConfirmDeleteDialog="confirmDelete"
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
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import type { Listing } from '@/interfaces/listing.interface'
import { useDialog } from 'primevue/usedialog'
import { defineAsyncComponent } from 'vue'
import UsersListing from './UsersListing.vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useAppStore } from '@/stores/app'

import API from '@/api'

const store = useAppStore()

const confirm = useConfirm()

const toast = useToast()

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

const ListingDialog = defineAsyncComponent(
  () => import('@/components/misc/listing/ListingDialog.vue')
)

const showFullAptData = (item: Listing) => {
  dialog.open(ListingDialog, {
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

const confirmDelete = async (item: Listing) => {
  confirm.require({
    message: 'Are you sure you want to delete this listing?',
    header: 'Warning',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    accept: async () => {
      try {
        if (!store.connectedUser) throw new Error('User not connected')
        await API.deleteListing(item.listingId, store.connectedUser)
        toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Listing deleted', life: 3000 })
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error'
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: `Could not delete listing: ${errorMessage}`,
          life: 3000
        })
      }
    }
  })
}
</script>
