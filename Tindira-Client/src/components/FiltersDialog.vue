<template>
    <div class="flex items-center space-x-4">
        <Chip label="Max Price/Month" class="flex-grow" />
        <InputNumber v-model="price" inputId="currency-il" mode="currency" currency="ILS" locale="en-US"
            class="flex-grow" />
    </div>
    <div class="flex items-center space-x-4">
        <Chip label="City" class="flex-grow" />
        <Dropdown v-model="selectedFilters.selectedCity" filter :options="citiesInIsrael || []"
            placeholder="Choose a Category" class="flex-grow" />
    </div>
    <div class="flex items-center space-x-4">
        <Chip label="Category" class="flex-grow" />
        <Dropdown v-model="selectedFilters.category" :options="categoryOptions" placeholder="Choose a Category"
            class="flex-grow" />
    </div>
    <div class="flex items-center space-x-4">
        <Chip label="Animal Friendly" />
        <Checkbox v-model="selectedFilters.isAnimalFriendly" :binary="true" />
    </div>
    <div class="flex items-center space-x-4">
        <Chip label="Min Parkings" />
        <InputNumber v-model="selectedFilters.parkings" showButtons buttonLayout="vertical" :min="0" :max="10">
            <template #incrementbuttonicon>
                <Icon icon="mdi:plus"></Icon>
            </template>
            <template #decrementbuttonicon>
                <Icon icon="mdi:minus"></Icon>
            </template>
        </InputNumber>
    </div>
    <div class="flex items-center space-x-4">
        <Chip label="Min Rooms" />
        <InputNumber v-model="selectedFilters.numberOfRooms" showButtons buttonLayout="vertical" :min="0" :max="10">
            <template #incrementbuttonicon>
                <Icon icon="mdi:plus"></Icon>
            </template>
            <template #decrementbuttonicon>
                <Icon icon="mdi:minus"></Icon>
            </template>
        </InputNumber>
    </div>
    <div class="flex items-center space-x-4">
        <Chip label="Dates" />

        <Calendar v-model="selectedFilters.dates" selectionMode="range" :manualInput="false" dateFormat="dd/mm/yy" />
    </div>

    <Button text rounded @click="userStore.updateFilters(selectedFilters); closeDialog()">
        <template #icon>
            <Icon icon="mdi:content-save"></Icon>
        </template>
    </Button>

</template>

<script setup lang="ts">
import { reactive, ref, inject } from 'vue'
import { Icon } from '@iconify/vue'
import ProgressSpinner from 'primevue/progressspinner'
import Dropdown from 'primevue/dropdown';
import Chip from 'primevue/chip';
import Button from 'primevue/Button';
import { useAppStore } from '../stores/app'
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import { getCities } from '@/api/GetCitiesApi';
import Checkbox from 'primevue/checkbox';
import Calendar from 'primevue/calendar';

const userStore = useAppStore()

const selectedFilters = reactive({ ...userStore.SelectedFilters })

let dates = ref()
let price = ref()

const categoryOptions = ref([
    "sublet",
    "rent",
    "animel sublet",
    "switch",
    "buy"
])
let citiesInIsrael = ref(await getCities())

const dialogRef = inject('dialogRef');

function closeDialog() {
    (dialogRef as any).value.close();
}





</script>