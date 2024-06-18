<template>
  <div>
    <div v-if="listings !== undefined">
      <DataView v-if="listings.length" :value="listings" dataKey="listingId">
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
      </DataView>
      <div
        v-else
        class="flex flex-col items-center justify-center text-lg text-center text-surface-600 dark:text-surface-900 mx-auto px-4 max-w-xl mt-10"
      >
        <h2 class="font-bold mb-4">No Listings Found</h2>
        <p class="mb-4">
          Your portfolio appears to be empty. This is a golden opportunity to highlight your
          offerings to potential clients.
        </p>
        <p>
          Ready to make your mark? Click
          <RouterLink
            to="/add"
            class="text-primary-500 hover:text-primary-600 transition duration-200 ease-in-out"
          >
            here
          </RouterLink>
          to add your first listing.
        </p>
      </div>
    </div>
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
        width: '100%',
        maxWidth: '896px' // max-w-4xl
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
        width: '100%',
        maxWidth: '896px' // max-w-4xl
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
        width: '100%',
        maxWidth: '896px' // max-w-4xl
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
        await store.deleteListing(item.listingId)
        toast.add({
          severity: 'success',
          summary: 'Confirmed',
          detail: 'Listing deleted successfully!',
          life: 3000
        })
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
