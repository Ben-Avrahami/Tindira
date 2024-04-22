<template>
    <div class="flex items-center space-x-4">
        <Chip label="Price" class="flex-grow" />
        <InputNumber v-model="price" inputId="currency-il" mode="currency" currency="ILS" locale="en-US"
            class="flex-grow" />
    </div>
    <div class="flex items-center space-x-4">
        <Chip label="City" class="flex-grow" />
        <Dropdown v-model="selectedCity" filter :options="citiesInIsrael || []" placeholder="Choose a Category"
            class="flex-grow" />
    </div>
    <div class="flex items-center space-x-4">
        <Chip label="Category" class="flex-grow" />
        <Dropdown v-model="selectedCategory" :options="categoryOptions" placeholder="Choose a Category"
            class="flex-grow" />
    </div>
    <div class="flex items-center space-x-4">
        <Chip label="Animel Friendly" class="flex-grow" />
        <Dropdown v-model="selectedCategory" :options="categoryOptions" placeholder="Choose a Category"
            class="flex-grow" />
    </div>
    <div class="flex items-center space-x-4">
        <Chip label="Number of Parkings" class="flex-grow" />
        <InputNumber v-model="parkings" showButtons buttonLayout="vertical" :min="0" :max="10" class="flex-grow">
            <template #incrementbuttonicon>
                <Icon icon="mdi:plus"></Icon>
            </template>
            <template #decrementbuttonicon>
                <Icon icon="mdi:minus"></Icon>
            </template>
        </InputNumber>
    </div>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import ProgressSpinner from 'primevue/progressspinner'
import Dropdown from 'primevue/dropdown';
import Chip from 'primevue/chip';
import { useAppStore } from '../stores/app'
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import { getCities } from '@/api/GetCitiesApi';

const userStore = useAppStore()


let selectedFilters = ref()
let price = ref()
let parkings = ref()
const categoryOptions = ref([
    "sublet",
    "rent",
    "animel sublet",
    "switch",
    "buy"
])
let citiesInIsrael = ref(await getCities())

const selectedCategory = ref("sublet")
const selectedCity = ref()


function setPlace() {
    console.log("Place set")
}



</script>