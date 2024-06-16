<template>
  <div></div>
</template>

<script setup lang="ts">
import API from '@/api'
import { useAppStore } from '@/stores/app'
import { useDialog } from 'primevue/usedialog'
import { defineAsyncComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const listingId = route.query.id?.toString()
let listing = ref()
const userStore = useAppStore()

if (listingId) listing.value = (await API.getListingsById([listingId]))[0]
else router.push('/')

const ListingDialog = defineAsyncComponent(
  () => import('@/components/misc/listing/ListingDialog.vue')
)
const dialog = useDialog()
dialog.open(ListingDialog, {
  data: {
    listing: listing.value,
    showLikeAndDislikeButton: userStore.isUserConnected
  },
  props: {
    header: listing.value.title,
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
    if (isLike?.data !== undefined && userStore.isUserConnected) {
      await API.tagListing(listing.value.listingId, userStore.connectedUser!, isLike.data)
    }
    router.push('/')
  }
})
</script>
