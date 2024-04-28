<template>
    <AutoComplete v-model="location" clearable optionLabel="description" :suggestions="suggestions"
        @item-select="updateLocation" @clear="cleared" id="selected-address" />
</template>

<script setup lang="ts">
import type { Location } from '@/stores/State.interface';
import { ref, type PropType, type Ref } from 'vue';
import { usePlacesAutocomplete } from 'vue-use-places-autocomplete';


const props = defineProps({
    modelValue: {
        type: Object as PropType<Location | string>,
        default: '',
    },
});
const emit = defineEmits(['locationChosen','locationCleared'])
let location: Ref<string>;
if (typeof props.modelValue === 'string') {
    location = ref(props.modelValue);
} else {
    location = ref(props.modelValue?.description || '');
}
const { suggestions } = usePlacesAutocomplete(location, {
    apiOptions: {
        version: 'weekly',
    },
    autocompletionRequest: {
        // region: 'IL',
    },
    debounce: 500,
    minLengthAutocomplete: 3
});

function updateLocation() {
    emit('locationChosen', location);
};
function cleared() {
    emit('locationCleared', location);
};

</script>