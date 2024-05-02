<template>

<GoogleMap :api-key="apiKey" style="width: 100%; height: 250px" :center="center" :zoom="15">
        <Marker :options="markerOptions" />
    </GoogleMap>

</template>

<script setup lang="ts">
import { GoogleMap, Marker } from 'vue3-google-map'

const center = { lat: 40.689247, lng: -74.044502 }
const markerOptions = { position: center, label: 'L', title: 'LADY LIBERTY' }

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
</script>