<template>
  <div class="flex items-center space-x-4">
    <Chip label="Category" />
    <Dropdown v-model="selectedFilters.category" :options="categoryOptions" placeholder="Choose a Category" />
  </div>
  <Divider />
  
  <div class="flex items-center space-x-4">
    <Chip label="Max Price/Month" />
    <InputNumber v-model="selectedFilters.maxPrice" inputId="currency-il" mode="currency" currency="ILS"
      locale="en-US" />
  </div>
  <Divider />
  <div class="flex items-center space-x-4">
    <Chip label="Preferred Location" />
    <GoogleMapsAutoComplete @locationChosen="updateLocation" @location-cleared="locationCleared"
      :modelValue="selectedFilters.location as string | Location | undefined">
    </GoogleMapsAutoComplete>
  </div>

  <div class="flex items-center space-x-4">
    <Chip label="Radius From Location(Km)" />
    <InputNumber v-model="selectedFilters.radius" showButtons :min="1" :max="100">
      <template #incrementbuttonicon>
        <Icon icon="mdi:plus"></Icon>
      </template>
      <template #decrementbuttonicon>
        <Icon icon="mdi:minus"></Icon>
      </template>
    </InputNumber>
  </div>
  <Divider />
  <div class="flex items-center space-x-4">
    <Chip label="Animal Friendly" />
    <Checkbox v-model="selectedFilters.isAnimalFriendly" :binary="true" />
  </div>
  <Divider />
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
  <Divider />
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
  <Divider />
  <div class="flex items-center space-x-4">
    <Chip label="Dates" />

    <Calendar v-model="selectedFilters.dates" selectionMode="range" showButtonBar :manualInput="false"
      dateFormat="dd/mm/yy" />
  </div>
  <div class="flex items-center space-x-4" v-if="selectedFilters.dates">
    <Chip label="Only display aparetments that are avilable for the whole time?" />
    <Checkbox v-model="selectedFilters.isWholeDateRangeOnly" :binary="true" />
  </div>

  <Divider />
  <div class="flex items-center justify-center">
    <Button text rounded @click="userStore.updateFilters(selectedFilters), closeDialog()">
      <template #icon>
        <Icon icon="mdi:content-save"></Icon>
      </template>
    </Button>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, inject, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useAppStore } from '../stores/app'
import { getCities } from '@/api/GetCitiesApi'
import GoogleMapsAutoComplete from './GoogleMapsAutoComplete.vue';
import type { Location } from '@/stores/State.interface';


const userStore = useAppStore()
const selectedFilters = reactive({ ...userStore.SelectedFilters })


function updateLocation(location: any) {
  selectedFilters.location = location;
}

function locationCleared(location: any) {
  selectedFilters.location = null;
}


const categoryOptions = ref(['sublet', 'rent', 'animel sublet', 'switch', 'buy'])
let citiesInIsrael = ref(await getCities())

const dialogRef = inject('dialogRef')

function closeDialog() {
  (dialogRef as any).value.close()
}
</script>
