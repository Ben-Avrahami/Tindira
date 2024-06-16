<template>
  <div class="flex flex-col justify-center mx-auto max-w-3xl">
    <div>
      <ImageCarousel :images="listing.images" />
    </div>

    <Divider />

    <GoogleMap :center="listing.coordinates.geometry.location" :name="listing.title" />

    <Divider />
    <div class="text-center dark:text-white">
      <label class="font-bold block">Address:</label>
      <p>{{ listing.coordinates.formatted_address }}</p>
      <label class="font-bold block">Description:</label>
      <p>{{ listing.description }}</p>
      <label class="font-bold block">Price:</label>
      <p>
        {{ listing.isPricePerWholeTime ? listing.pricePerWholeTime : listing.pricePerMonth }}
        ₪/{{ listing.isPricePerWholeTime ? 'Whole Time' : 'Month' }}
      </p>
      <label class="font-bold block">Number Of Rooms:</label>
      <p>{{ listing.numberOfRooms }}</p>
      <label class="font-bold block">Parkings Slots:</label>
      <p>{{ listing.parkingSpaces }}</p>
      <label v-if="listing.isAnimalFriendly" class="font-bold block">
        Apartment is Animal Friendly!
      </label>
      <label v-if="listing.isWithGardenOrPorch" class="font-bold block"
        >Apartment Has a Porch or a Garden
      </label>
      <label class="font-bold block">contract Starting Date:</label>
      <p>{{ listing.contractStartDate }}</p>
      <label class="font-bold block">contract Ending Date:</label>
      <p>{{ listing.contractEndDate }}</p>
      <label class="font-bold block">Post Upload Date:</label>
      <p>{{ listing.postUploadDate }}</p>

      <div class="flex justify-center mt-1">
        <Button rounded text aria-label="Like" @click="copyToClipboard(listing)">
          <template #icon>
            <Icon icon="iconamoon:link" style="font-size: 40px"></Icon>
          </template>
        </Button>
      </div>

      <Divider />

      <div class="mx-auto space-x-24 flex justify-center mt-1" v-if="showLikeAndDislikeButton">
        <Button severity="secondary" rounded aria-label="Like" @click="closeDialog(false)">
          <template #icon>
            <Icon icon="mdi:times"></Icon>
          </template>
        </Button>

        <Button class="text-rose-700" rounded aria-label="Like" @click="closeDialog(true)">
          <template #icon>
            <Icon icon="ph:heart"></Icon>
          </template>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import ImageCarousel from '@/components/misc/ImageCarousel.vue'
import GoogleMap from '@/components/misc/google_maps/GoogleMap.vue'
import type { Listing } from '@/interfaces/listing.interface'
import { injectToast } from '@/functions/inject'

const toast = injectToast()

defineProps<{
  listing: Listing
  showLikeAndDislikeButton?: Boolean
  closeDialog: (isLike: boolean) => void
}>()

const copyToClipboard = (listing: Listing) => {
  const url = `${window.location.origin}/listing?id=${listing.listingId}`
  navigator.clipboard.writeText(url)
  toast.add({
    severity: 'info',
    summary: 'Copied!',
    detail: 'Listing link copied to clipboard',
    life: 3000
  })
}
</script>
