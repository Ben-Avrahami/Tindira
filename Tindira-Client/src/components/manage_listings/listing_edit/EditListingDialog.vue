<template>
  <div>
    <div v-if="!dialogRef">
      <p>Loading...</p>
    </div>
    <div v-else-if="fetchingFailed">
      <p>Failed to fetch listing data!</p>
    </div>
    <EditListingForm v-else :listing="dialogRef.data.listing" :exit="closeDialog" />
  </div>
</template>

<script setup lang="ts">
import * as ListingInterface from '@/interfaces/listing.interface'
import { ref, inject, type Ref, watchEffect } from 'vue'
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'

import EditListingForm from './EditListingForm.vue'

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

const closeDialog = () => {
  dialogRef?.value.close()
}
</script>
