<template>
  <AutoComplete
    v-model="location"
    clearable
    optionLabel="description"
    :suggestions="suggestions"
    @itemSelect="updateLocation"
    @clear="locationCleared"
    inputId="selected-address"
  />
</template>

<script setup lang="ts">
import type { SavedGeoCodeGoogleLocation } from '@/interfaces/geolocation.interface'
import { ref } from 'vue'
import { usePlacesAutocomplete, geocodeByPlaceId } from 'vue-use-places-autocomplete'

const props = defineProps<{
  locationString?: string
  locationChosen: (location: SavedGeoCodeGoogleLocation) => void
  locationCleared: () => void
}>()

const location = ref<any>(props.locationString || '')

const { suggestions } = usePlacesAutocomplete(location, {
  apiOptions: {
    version: 'weekly'
  },
  autocompletionRequest: {
    // region: 'IL',
  },
  debounce: 1000,
  minLengthAutocomplete: 3
})

async function updateLocation() {
  if (!location.value) return
  const geoCode = await geocodeByPlaceId(location.value.place_id)
  if (geoCode.length === 0) return
  const locationData = geoCode[0]
  props.locationChosen({
    formatted_address: locationData.formatted_address,
    geometry: {
      location: {
        lat: locationData.geometry.location.lat(),
        lng: locationData.geometry.location.lng()
      },
      viewport: {
        north: locationData.geometry.viewport.getNorthEast().lat(),
        south: locationData.geometry.viewport.getSouthWest().lat(),
        east: locationData.geometry.viewport.getNorthEast().lng(),
        west: locationData.geometry.viewport.getSouthWest().lng()
      }
    },
    place_id: locationData.place_id
  })
}
</script>
