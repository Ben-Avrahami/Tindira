<template>
  <div>
    <div v-if="!dialogRef">
      <p>Loading...</p>
    </div>
    <div v-else-if="fetchingFailed">
      <p>Failed to fetch listing likes!</p>
    </div>
    <ListingLikesForm v-else :listingId="dialogRef.data.listing.listingId" />
  </div>
</template>

<script setup lang="ts">
import * as ListingInterface from '@/interfaces/listing.interface'
import { watchEffect, ref, type Ref } from 'vue'
import { inject } from 'vue'
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'
import ListingLikesForm from './ListingLikesForm.vue'

const dialogRef = inject<Ref<DynamicDialogInstance>>('dialogRef')

const listing = ref<ListingInterface.Listing>()

const fetchingFailed = ref(false)

watchEffect(() => {
  if (dialogRef && dialogRef.value) {
    const potentialListing = dialogRef?.value.data.listing
    if (ListingInterface.isListingInterface(potentialListing)) {
      listing.value = potentialListing
    } else {
      fetchingFailed.value = true
      console.error('Type check failed for listing:', potentialListing)
    }
  }
})
</script>
