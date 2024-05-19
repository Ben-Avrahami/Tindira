<template>

    <div>
        <AptImageCarousel />
    </div>

    <Divider />

    <GoogleMap :center="listing.coordinates.geometry.location" :name="listing.title"></GoogleMap>

    <Divider />
    <div class="text-center">
        <label class="font-bold block">Adress:</label>
        <p>{{ listing.coordinates.formatted_address}}</p>
        <label class="font-bold block">Description:</label>
        <p>{{ listing.description }}</p>
        <label class="font-bold block">Price:</label>
        <p>{{ listing.price }}₪ </p>
        <label class="font-bold block">Number Of Rooms:</label>
        <p>{{ listing.numberOfRooms }} </p>
        <label class="font-bold block">Amount Of Parkings:</label>
        <p>{{ listing.parking }} </p>
        <label v-if="listing.isAnimalFriendly" class="font-bold block">Apartment Is Animel Friendly!</label>
        <label class="font-bold block">contract Starting Date:</label>
        <p>{{ listing.contractStartingDate }} </p>
        <label class="font-bold block">Post Upload Date:</label>
        <p>{{ listing.postUploadDate }} </p>

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

const center = { lat: 40.689247, lng: -74.044502 }
const markerOptions = { position: center, label: 'L', title: 'LADY LIBERTY' }

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


function closeDialog(isLike: boolean) {
    dialogRef?.value.close(isLike)
}
</script>