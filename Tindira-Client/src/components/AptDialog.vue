<template>

    <div>
        <AptImageCarousel />
    </div>

    <Divider />

    <GoogleMap :center="listing?.coordinates?.geometry?.location" :name="listing?.title"></GoogleMap>

    <Divider />
    <div class="text-center dark:text-white">
        <label class="font-bold block">Adress:</label>
        <p>{{ listing?.coordinates?.formatted_address }}</p>
        <label class="font-bold block">Description:</label>
        <p>{{ listing?.description }}</p>
        <label class="font-bold block">Price:</label>
        <p>{{ listing?.isPricePerWholeTime ? listing?.pricePerWholeTime : listing?.pricePerMonth }} ₪/{{listing?.isPricePerWholeTime ? "Whole Time" : "Month"  }} </p>
        <label class="font-bold block">Number Of Rooms:</label>
        <p>{{ listing?.numberOfRooms }} </p>
        <label class="font-bold block">Amount Of Parkings:</label>
        <p>{{ listing?.parkingSpaces }} </p>
        <label v-if="listing.isAnimalFriendly" class="font-bold block">Apartment is Animal Friendly!</label>
        <label v-if="listing.isWithGardenOrPorch" class="font-bold block">Apartment Has a Porch or a Garden </label>
        <label class="font-bold block">contract Starting Date:</label>
        <p>{{ listing?.contractStartDate }} </p>
        <label class="font-bold block">contract Ending Date:</label>
        <p>{{ listing?.contractEndDate }} </p>
        <label class="font-bold block">Post Upload Date:</label>
        <p>{{ listing?.postUploadDate }} </p>

        <Divider />

        <div class=" mx-auto space-x-24 flex justify-center mt-1">
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

</template>

<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useAppStore } from '../stores/app'
import AptImageCarousel from './AptImageCarousel.vue';
import GoogleMap from './GoogleMap.vue';
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'
import type { Listing } from '../interfaces/listing.interface';

const dialogRef = inject<Ref<DynamicDialogInstance>>('dialogRef')

const listing = dialogRef?.value.data.listing as Listing;

function closeDialog(isLike: boolean) {
    dialogRef?.value.close(isLike)
}
</script>