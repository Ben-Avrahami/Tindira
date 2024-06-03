<template>
  <div class="flex flex-wrap gap-3 p-fluid">
    <div class="flex-auto">
      <label class="font-bold block mb-2"> Category </label>
      <Dropdown v-model="selectedFilters.category" @change='changeCategory' :options="userStore.categoryOptions"
        placeholder="Choose a Category" />
    </div>
  </div>
  <Divider />

  <div class="flex flex-wrap gap-3 p-fluid">
    <div class="flex-auto">
      <div v-if="selectedFilters.category == 'sublet'">
        <label class="font-bold block mb-2">
          is Price Per Month or Whole Time?
        </label>
        <SelectButton v-model="priceTime" :options="priceTimeOptions" @change="priceTimeChanged"
          aria-labelledby="price time selector" />
      </div>
      <label class="font-bold block mb-2">
        {{ selectedFilters.category === 'rent' ? 'Price/Month' : (selectedFilters.isPricePerWholeTime ? 'Price/Whole Time' : 'Price/Month') }}
      </label>
      <InputNumber v-model="selectedFilters.maxPrice" inputId="currency-il" mode="currency" currency="ILS"
        locale="en-US" />
    </div>

  </div>

  <Divider />
  <div class="flex flex-wrap gap-3 p-fluid">
    <div class="flex-auto">
      <label class="font-bold block mb-2"> Preferred Location </label>
      <GoogleMapsAutoComplete @locationChosen="updateLocation" @location-cleared="locationCleared"
        :locationString="selectedFilters.location?.formatted_address">
      </GoogleMapsAutoComplete>
    </div>
  </div>

  <div class="flex flex-wrap gap-3 p-fluid">
    <div class="flex-auto">
      <label class="font-bold block mb-2"> Radius From Location(Km) </label>
      <Slider v-model="selectedFilters.radiusInKm" />
      <p>Kms: {{ selectedFilters.radiusInKm }}</p>
    </div>
  </div>

  <Divider />
  <div class="flex flex-wrap gap-3 p-fluid">
    <div class="flex-auto">
      <label class="font-bold block mb-2"> Must Be Animal Friendly </label>
      <Checkbox v-model="selectedFilters.isAnimalFriendly" :binary="true" />
    </div>
  </div>
  <Divider />
  <div class="flex flex-wrap gap-3 p-fluid">
    <div class="flex-auto">
      <label class="font-bold block mb-2"> Must Be With Porch Or Garden </label>
      <Checkbox v-model="selectedFilters.isWithPorchOrGarden" :binary="true" />
    </div>
  </div>
  <Divider />

  <div class="flex flex-wrap gap-3 p-fluid">
    <div class="flex-auto">
      <label class="font-bold block mb-2"> Min Parkings </label>
      <Slider v-model="selectedFilters.minNumberOfParkings" :min="0" :max="10" />
      <p>Parkings: {{ selectedFilters.minNumberOfParkings }}</p>
    </div>
  </div>

  <Divider />
  <div class="flex flex-wrap gap-3 p-fluid">
    <div class="flex-auto">
      <label class="font-bold block mb-2"> Min Rooms </label>
      <Slider v-model="selectedFilters.minNumberOfRooms" :min="0" :max="10" />
      <p>Rooms: {{ selectedFilters.minNumberOfRooms }}</p>
    </div>
  </div>

  <Divider />

  <div class="flex flex-wrap gap-3 p-fluid">
    <div class="flex-auto">
      <label class="font-bold block mb-2">
        {{ selectedFilters.category === 'rent' ? 'Starting Date' : "Date Range" }}
      </label>
      <Calendar v-model="selectedFilters.dates"
        :selectionMode="selectedFilters.category === 'rent' ? 'single' : 'range'" showButtonBar :manualInput="false"
        dateFormat="dd/mm/yy" />
    </div>
  </div>
  <div class="flex flex-wrap gap-3 p-fluid" v-if="selectedFilters.dates">
    <div class="flex-auto"  v-if="selectedFilters.category === 'sublet'">
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
import GoogleMapsAutoComplete from './GoogleMapsAutoComplete.vue';


const userStore = useAppStore()
const selectedFilters = reactive({ ...userStore.SelectedFilters })
let priceTime = ref('Month');
let priceTimeOptions = ref(['Month', 'Whole Time']);

function priceTimeChanged(event: any) {
  selectedFilters.isPricePerWholeTime = event.value === 'Whole Time';
}


function updateLocation(location: any) {
  selectedFilters.location = location;
}

function changeCategory(){
  selectedFilters.isPricePerWholeTime = false;
  priceTime.value = 'Month';
  selectedFilters.dates=null;
  selectedFilters.isWholeDateRangeOnly = false;
}

function locationCleared() {
  selectedFilters.location = null;
}

const dialogRef = inject('dialogRef')

function closeDialog() {
  (dialogRef as any).value.close()
}
</script>
