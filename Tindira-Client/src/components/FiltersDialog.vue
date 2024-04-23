<template>
    <div class="flex items-center space-x-4">
        <Chip label="Max Price/Month" />
        <InputNumber v-model="selectedFilters.maxPrice" inputId="currency-il" mode="currency" currency="ILS" locale="en-US"
          />
    </div>
    <div class="flex items-center space-x-4">
        <Chip label="City"  />
        <Dropdown v-model="selectedFilters.city" filter :options="citiesInIsrael || []"
            placeholder="Choose a City"  />
    </div>
    <div class="flex items-center space-x-4">
        <Chip label="Category"  />
        <Dropdown v-model="selectedFilters.category" :options="categoryOptions" placeholder="Choose a Category"
            />
    </div>
    <div class="flex items-center space-x-4">
        <Chip label="Animal Friendly" />
        <Checkbox v-model="selectedFilters.isAnimalFriendly" :binary="true" />
    </div>
    <div class="flex items-center space-x-4">
        <Chip label="Min Parkings" />
        <InputNumber v-model="selectedFilters.minNumberOfParkings" showButtons :min="0" :max="10">
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
        <InputNumber v-model="selectedFilters.minNumberOfRooms" showButtons :min="0" :max="10">
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
        
        <Calendar v-model="selectedFilters.dates" selectionMode="range" showButtonBar  :manualInput="false" dateFormat="dd/mm/yy" />
    </div>
    <div class="flex items-center space-x-4" v-if="selectedFilters.dates">
        <Chip label="Only display aparetments that are avilable for the whole time?" />
        <Checkbox v-model="selectedFilters.isWholeDateRangeOnly" :binary="true" />
    </div>
    
    <div class="flex items-center justify-center">
        <Button text rounded @click="userStore.updateFilters(selectedFilters); closeDialog()">
            <template #icon>
                <Icon icon="mdi:content-save"></Icon>
            </template>
        </Button>
    </div>

</template>

<script setup lang="ts">
import { reactive, ref, inject } from 'vue'
import { Icon } from '@iconify/vue'
import Dropdown from 'primevue/dropdown';
import Chip from 'primevue/chip';
import Button from 'primevue/Button';
import { useAppStore } from '../stores/app'
import InputNumber from 'primevue/inputnumber';
import { getCities } from '@/api/GetCitiesApi';
import Checkbox from 'primevue/checkbox';
import Calendar from 'primevue/calendar';

const userStore = useAppStore()

const selectedFilters = reactive({ ...userStore.SelectedFilters })


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