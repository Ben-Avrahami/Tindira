<template>
    <AutoComplete v-model="location" clearable optionLabel="description" :suggestions="suggestions"
        @item-select="updateLocation" @clear="cleared" id="selected-address" />
</template>

<script setup lang="ts">
import type { GeoCodeGoogleLocation, Location } from '@/stores/State.interface';
import { ref, type PropType, type Ref } from 'vue';
import { usePlacesAutocomplete, geocodeByPlaceId } from 'vue-use-places-autocomplete';


const props = defineProps({
    locationString: {
        type: String,
        default: '',
    },
});
const emit = defineEmits(['locationChosen', 'locationCleared'])
let location: Ref<any>;
location = ref(props.locationString);

const { suggestions } = usePlacesAutocomplete(location, {
    apiOptions: {
        version: 'weekly',
    },
    autocompletionRequest: {
        // region: 'IL',
    },
    debounce: 1000,
    minLengthAutocomplete: 3
});

async function updateLocation() {
    const geoCode = await geocodeByPlaceId((location.value as Location).place_id);
    const result = geoCode.length === 1 ? geoCode[0] : geoCode;
    
    const { location_type, ...geometryWithoutLocationType } = result.geometry;
    const logObject = {
        formatted_address: result.formatted_address,
        geometry: geometryWithoutLocationType,
        place_id: result.place_id
    };
    console.log("geoCode object", JSON.stringify(logObject));
    emit('locationChosen', result);
};
function cleared() {
    emit('locationCleared');
};

</script>