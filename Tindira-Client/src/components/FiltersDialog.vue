<template>
  <div class="lex flex-wrap gap-3 p-fluid">
    <div class="flex-auto">
      <label class="font-bold block mb-2"> Category </label>
      <Dropdown v-model="selectedFilters.category" :options="categoryOptions" placeholder="Choose a Category" />
    </div>
  </div>
  <Divider />

  <div class="lex flex-wrap gap-3 p-fluid">
    <div class="flex-auto">
      <label class="font-bold block mb-2"> Max Price/Month </label>
      <InputNumber v-model="selectedFilters.maxPrice" inputId="currency-il" mode="currency" currency="ILS"
        locale="en-US" />
    </div>
  </div>

  <Divider />
  <div class="lex flex-wrap gap-3 p-fluid">
    <div class="flex-auto">
      <label class="font-bold block mb-2"> Preferred Location </label>
      <GoogleMapsAutoComplete @locationChosen="updateLocation" @location-cleared="locationCleared"
        :modelValue="selectedFilters.location as string | Location | undefined">
      </GoogleMapsAutoComplete>
    </div>
  </div>

  <div class="lex flex-wrap gap-3 p-fluid">
    <div class="flex-auto">
      <label class="font-bold block mb-2"> Radius From Location(Km) </label>
      <InputNumber v-model="selectedFilters.radiusInKm" style="max-width: 40vw;" showButtons :min="1" :max="100">
        <template #incrementbuttonicon>
          <Icon icon="mdi:plus"></Icon>
        </template>
        <template #decrementbuttonicon>
          <Icon icon="mdi:minus"></Icon>
        </template>
      </InputNumber>
    </div>
  </div>

  <Divider />
  <div class="lex flex-wrap gap-3 p-fluid">
    <div class="flex-auto">
      <label class="font-bold block mb-2"> Must Be Animal Friendly </label>
      <Checkbox v-model="selectedFilters.isAnimalFriendly" :binary="true" />
    </div>
  </div>
  <Divider />
  <div class="lex flex-wrap gap-3 p-fluid">
    <div class="flex-auto">
      <label class="font-bold block mb-2"> Must Be With Porch Or Garden </label>
      <Checkbox v-model="selectedFilters.isWithPorchOrGarden" :binary="true" />
    </div>
  </div>
  <Divider />

  <div class="lex flex-wrap gap-3 p-fluid">
    <div class="flex-auto">
      <label class="font-bold block mb-2"> Must Be With Elevator </label>
      <Checkbox v-model="selectedFilters.isWithElevator" :binary="true" />
    </div>
  </div>

  <Divider />

  <div class="lex flex-wrap gap-3 p-fluid">
    <div class="flex-auto">
      <label class="font-bold block mb-2"> Min Parkings </label>
      <InputNumber v-model="selectedFilters.minNumberOfParkings" showButtons :min="0" :max="10">
        <template #incrementbuttonicon>
          <Icon icon="mdi:plus"></Icon>
        </template>
        <template #decrementbuttonicon>
          <Icon icon="mdi:minus"></Icon>
        </template>
      </InputNumber>
    </div>
  </div>

  <Divider />
  <div class="lex flex-wrap gap-3 p-fluid">
    <div class="flex-auto">
      <label class="font-bold block mb-2"> Min Rooms </label>

      <InputNumber v-model="selectedFilters.minNumberOfRooms" showButtons :min="0" :max="10">
        <template #incrementbuttonicon>
          <Icon icon="mdi:plus"></Icon>
        </template>
        <template #decrementbuttonicon>
          <Icon icon="mdi:minus"></Icon>
        </template>
      </InputNumber>
    </div>
  </div>

  <Divider />

  <div class="lex flex-wrap gap-3 p-fluid">
    <div class="flex-auto">
      <label class="font-bold block mb-2"> Dates </label>
      <Calendar v-model="selectedFilters.dates" selectionMode="range" showButtonBar :manualInput="false"
        dateFormat="dd/mm/yy" />
    </div>
  </div>
  <div class="lex flex-wrap gap-3 p-fluid" v-if="selectedFilters.dates">
    <div class="flex-auto">
      <label class="font-bold block mb-2"> Only display aparetments that are avilable for the whole time? </label>
      <Checkbox v-model="selectedFilters.isWholeDateRangeOnly" :binary="true" />
    </div>
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
// let citiesInIsrael = ref(await getCities()) TODO:Remove later, cuurently is not being used, but keeping it for being used maybe in future

const dialogRef = inject('dialogRef')

function closeDialog() {
  (dialogRef as any).value.close()
}
</script>
