<template>
  <GoogleMap :api-key="apiKey" style="width: 100%; height: 250px" :center="mapCenter" :zoom="10">
    <Marker
      v-if="center"
      :options="{
        position: mapCenter,
        label: 'Apt',
        title: name || ''
      }"
    />
  </GoogleMap>
</template>

<script setup lang="ts">
import { GoogleMap, Marker } from 'vue3-google-map'
import { computed } from 'vue'

const props = defineProps<{
  center?: {
    lat: number
    lng: number
  }
  name?: string
}>()

const defaultCenter = { lat: 32.109333, lng: 34.855499 } // Tel Aviv

const mapCenter = computed(() => props.center || defaultCenter)

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
</script>
