<template>
  <FiltersFormElement>
    <label class="font-bold block mb-2"> Category </label>
    <Dropdown
      v-model="selectedFilters.category"
      @change="changeCategory"
      :options="ListingConstants.CATEGORIES"
      placeholder="Choose a Category"
    />
  </FiltersFormElement>

  <Divider />

  <FiltersFormElement>
    <div v-if="selectedFilters.category == 'sublet'">
      <label class="font-bold block mb-2"> Is the price per month or per whole period? </label>
      <SelectButton
        v-model="priceTime"
        :options="priceTimeOptions"
        @change="
          (event) => (selectedFilters.isPricePerWholeTime = event.value === priceTimeOptions[1])
        "
        aria-labelledby="price time selector"
      />
    </div>
    <label class="font-bold block mb-2">
      {{
        selectedFilters.category === 'rent' || !selectedFilters.isPricePerWholeTime
          ? 'Price/Month'
          : 'Price/Whole Period'
      }}
    </label>
    <InputNumber
      v-model="selectedFilters.maxPrice"
      inputId="currency-il"
      mode="currency"
      currency="ILS"
      locale="en-US"
    />
  </FiltersFormElement>

  <Divider />

  <FiltersFormElement>
    <label class="font-bold block mb-2"> Preferred Location </label>
    <GoogleMapsAutoComplete
      @locationChosen="(location) => (selectedFilters.location = location)"
      @locationCleared="() => (selectedFilters.location = null)"
      :locationString="selectedFilters.location?.formatted_address"
    >
    </GoogleMapsAutoComplete>
  </FiltersFormElement>

  <FiltersFormElement>
    <label class="font-bold block mb-2"> Radius From Location (Km) </label>
    <Slider v-model="selectedFilters.radiusInKm" />
    <p>Kms: {{ selectedFilters.radiusInKm }}</p>
  </FiltersFormElement>

  <Divider />

  <FiltersFormElement>
    <label class="font-bold block mb-2"> Must Be Animal Friendly </label>
    <Checkbox v-model="selectedFilters.isAnimalFriendly" binary />
  </FiltersFormElement>

  <Divider />

  <FiltersFormElement>
    <label class="font-bold block mb-2"> Must Have a Porch or a Garden </label>
    <Checkbox v-model="selectedFilters.isWithPorchOrGarden" binary />
  </FiltersFormElement>

  <Divider />

  <FiltersFormElement>
    <label class="font-bold block mb-2"> Min Parkings </label>
    <Slider
      v-model="selectedFilters.minNumberOfParkings"
      :min="0"
      :max="ListingConstants.MAX_PARKING_SPOTS"
    />
    <p>Parkings: {{ selectedFilters.minNumberOfParkings }}</p>
  </FiltersFormElement>

  <Divider />

  <FiltersFormElement>
    <label class="font-bold block mb-2"> Min Rooms </label>
    <Slider v-model="selectedFilters.minNumberOfRooms" :min="0" :max="ListingConstants.MAX_ROOMS" />
    <p>Rooms: {{ selectedFilters.minNumberOfRooms }}</p>
  </FiltersFormElement>

  <Divider />

  <FiltersFormElement>
    <label class="font-bold block mb-2">
      {{ selectedFilters.category === 'rent' ? 'Starting Date' : 'Date Range' }}
    </label>
    <Calendar
      v-model="selectedFilters.dates"
      :selectionMode="selectedFilters.category === 'rent' ? 'single' : 'range'"
      showButtonBar
      :manualInput="false"
      dateFormat="dd/mm/yy"
    />
  </FiltersFormElement>

  <FiltersFormElement v-if="selectedFilters.dates && selectedFilters.category === 'sublet'">
    <label class="font-bold block mb-2">
      Only display apartments that are available for the whole period?
    </label>
    <Checkbox v-model="selectedFilters.isWholeDateRangeOnly" binary />
  </FiltersFormElement>

  <Divider />

  <div class="flex items-center justify-center">
    <Button text rounded @click="save">
      <template #icon>
        <Icon icon="mdi:content-save"></Icon>
      </template>
    </Button>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, inject, type Ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useAppStore } from '@/stores/app'
import GoogleMapsAutoComplete from '@/components/GoogleMapsAutoComplete.vue'
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'
import * as ListingConstants from '@/interfaces/listing.interface'
import FiltersFormElement from './FiltersFormElement.vue'

const userStore = useAppStore()
const selectedFilters = reactive({ ...userStore.SelectedFilters })
const priceTimeOptions = ['Month', 'Whole Period']

const priceTime = ref<string>(
  selectedFilters.isPricePerWholeTime ? priceTimeOptions[1] : priceTimeOptions[0]
)

const changeCategory = () => {
  selectedFilters.isPricePerWholeTime = false
  priceTime.value = priceTimeOptions[0]
  selectedFilters.dates = null
  selectedFilters.isWholeDateRangeOnly = false
}

const dialogRef = inject<Ref<DynamicDialogInstance>>('dialogRef')

const save = () => {
  userStore.updateFilters(selectedFilters) // await?
  dialogRef?.value.close()
}
</script>
