<template>
  <div>
    <div v-if="!dialogRef">
      <p>Loading...</p>
    </div>
    <div v-else-if="!listing">
      <p>Failed to fetch listing!</p>
    </div>
    <ListingCard v-else :listing :showLikeAndDislikeButton="true" :closeDialog />
  </div>
</template>

<script setup lang="ts">
import * as ListingInterface from '@/interfaces/listing.interface'
import { watchEffect, inject, ref, type Ref } from 'vue'
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'

import ListingCard from './ListingCard.vue'

const dialogRef = inject<Ref<DynamicDialogInstance>>('dialogRef')

const listing = ref<ListingInterface.Listing>()

watchEffect(() => {
  if (dialogRef && dialogRef.value) {
    const potentialListing = dialogRef?.value.data.listing
    if (ListingInterface.isListingInterface(potentialListing)) {
      listing.value = potentialListing
    } else {
      console.error('Type check failed for listing:', potentialListing)
    }
  }
})

const closeDialog = (isLike: boolean) => {
  dialogRef?.value.close(isLike)
}
</script>
