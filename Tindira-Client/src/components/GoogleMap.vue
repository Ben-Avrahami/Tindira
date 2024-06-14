<template>
  <GoogleMap :api-key="apiKey" style="width: 100%; height: 250px" :center="center" :zoom="15">
    <Marker :options="markerOptions" />
  </GoogleMap>
</template>

<script setup lang="ts">
import { GoogleMap, Marker } from 'vue3-google-map'
import { computed } from 'vue'
import type { Geometry } from '@/interfaces/geolocation.interface'

const props = defineProps<{
  center?: Geometry['location']
  name?: string
}>()

const defaultCenter = { lat: 31.4117257, lng: 35.0818155 } // Tel Aviv

const mapCenter = computed(() => props.center || defaultCenter)

const markerOptions = { position: mapCenter.value, label: 'Apt', title: props.name }

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
</script>
