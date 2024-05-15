<template>

    <GoogleMap :api-key="apiKey" style="width: 100%; height: 250px" :center="center" :zoom="15">
        <Marker :options="markerOptions" />
    </GoogleMap>

</template>

<script setup lang="ts">
import { GoogleMap, Marker } from 'vue3-google-map'

import type { PropType } from 'vue'
import type { Geometry } from '@/interfaces/geolocation.interface';

const props = defineProps({
    center: Object as PropType<Geometry["location"]>,
    name: String
})

const markerOptions = { position: props.center, label: 'Apt', title: props.name }

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
</script>