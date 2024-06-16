<template>
  <div class="flex flex-col gap-4 dark:text-white">
    <InputGroup class="flex flex-col">
      <SelectButton
        v-model="category"
        :options="ListingInterface.CATEGORIES"
        aria-labelledby="basic"
      />
    </InputGroup>
    <InputGroup class="flex flex-col">
      <label class="flex" for="title">Title</label>
      <div class="flex">
        <InputText id="title" v-model="title" type="text" placeholder="Title" />
        <InputGroupAddon>
          <Icon icon="mdi:house" />
        </InputGroupAddon>
      </div>
    </InputGroup>
    <InputGroup class="flex flex-col w-full relative">
      <label class="flex" for="description">Description</label>
      <Textarea
        id="description"
        v-model="description"
        rows="10"
        cols="30"
        autoResize
        :maxlength="ListingInterface.MAX_DESCRIPTION_LENGTH"
        placeholder="Description"
      />
      <div class="absolute bottom-0 right-0 mb-1.5 mr-3 text-sm text-gray-500">
        {{ description.length }}/{{ ListingInterface.MAX_DESCRIPTION_LENGTH }}
      </div>
    </InputGroup>
    <InputGroup class="flex flex-col">
      <label class="flex" for="startDate">From</label>
      <Calendar
        inputId="startDate"
        class="w-full"
        v-model="contractStartDate"
        showIcon
        showButtonBar
      />
    </InputGroup>
    <InputGroup class="flex flex-col">
      <label class="flex" for="endingDate">To</label>
      <Calendar
        inputId="endingDate"
        class="w-full"
        v-model="contractEndDate"
        showIcon
        showButtonBar
      />
    </InputGroup>
    <InputGroup class="flex flex-col">
      <label class="flex" for="rooms">Rooms</label>
      <InputNumber
        class="w-full"
        inputId="rooms"
        v-model="numberOfRooms"
        mode="decimal"
        showButtons
        :min="1"
        :max="ListingInterface.MAX_ROOMS"
        :suffix="numberOfRooms === null ? '' : numberOfRooms > 1 ? ' rooms' : ' room'"
      />
    </InputGroup>
    <InputGroup class="flex flex-col">
      <label class="flex" for="parking">Parking</label>
      <InputNumber
        class="w-full"
        inputId="parking"
        v-model="parkingSpaces"
        mode="decimal"
        showButtons
        :min="0"
        :max="ListingInterface.MAX_PARKING_SPOTS"
        :suffix="parkingSpaces === 1 ? ' parking spot' : ' parking spots'"
      />
    </InputGroup>
    <InputGroup>
      <Checkbox inputId="animalFriendly" v-model="isAnimalFriendly" binary />
      <label for="animalFriendly" class="ml-2 text-gray-500">
        The apartment is animal friendly 🐈
      </label>
    </InputGroup>
    <InputGroup>
      <Checkbox inputId="gardenOrPorch" v-model="isWithGardenOrPorch" binary />
      <label for="gardenOrPorch" class="ml-2 text-gray-500">
        The apartment has a garden or porch 🌳
      </label>
    </InputGroup>
    <InputGroup v-if="category === 'sublet'" class="flex flex-col">
      <div class="mb-2 flex items-center">
        <RadioButton inputId="price" v-model="isPricePerWholeTime" :value="false" />
        <label for="price" class="ml-2">Price is per month</label>
      </div>
      <div class="flex items-center">
        <RadioButton inputId="pricePerPeriod" v-model="isPricePerWholeTime" :value="true" />
        <label for="pricePerPeriod" class="ml-2">Price is per whole period</label>
      </div>
    </InputGroup>
    <InputGroup class="flex flex-col">
      <label class="flex" for="price">
        {{ isPricePerWholeTime ? 'Price per whole period' : 'Price per month' }}
      </label>
      <div class="flex">
        <InputNumber
          class="w-full"
          inputId="price"
          v-model="price"
          mode="currency"
          currency="ILS"
          locale="he-IL"
          currencyDisplay="symbol"
        />
        <InputGroupAddon>
          <Icon icon="mdi:cash-multiple" />
        </InputGroupAddon>
      </div>
    </InputGroup>
    <InputGroup class="flex flex-col">
      <label class="flex" for="location">Location</label>
      <GoogleMapsAutoComplete
        class="mt-1 mb-2 w-full"
        :locationString="location?.formatted_address"
        :locationChosen="(loc: SavedGeoCodeGoogleLocation) => location = loc"
        :locationCleared="() => (location = null)"
      />
      <GoogleMap :center="location?.geometry.location" />
    </InputGroup>
    <InputGroup class="flex flex-col">
      <label class="flex">Images</label>
      <ListingImages
        :images="
          images.map((image, index) => ({
            fileName: `image-${index}`,
            content: image
          }))
        "
        :removeImage="(index) => images.splice(index, 1)"
        :addImage="(image: Image) => images.push(image.content)"
      />
    </InputGroup>
    <Divider class="w-full" />
    <div class="flex flex-col">
      <label class="flex"></label>
      <div class="flex justify-end gap-4">
        <Button severity="secondary" label="Cancel" class="w-1/3" @click="cancelForm" />
        <Button severity="secondary" label="Reset" class="w-1/3" @click="resetForm" />
        <Button label="Save" class="w-1/3" @click="saveForm" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as ListingInterface from '@/interfaces/listing.interface'
import { ref, watch } from 'vue'
import type { SavedGeoCodeGoogleLocation } from '@/interfaces/geolocation.interface'
import { Icon } from '@iconify/vue/dist/iconify.js'
import { injectToast } from '@/functions/inject'

import GoogleMap from '@/components/misc/google_maps/GoogleMap.vue'
import GoogleMapsAutoComplete from '@/components/misc/google_maps/GoogleMapsAutoComplete.vue'
import ListingImages from '@/components/misc/listing_form/ListingImages.vue'

import API, { type ListingPayload } from '@/api'
import type { Image } from '@/functions/aws'

const toast = injectToast()

const props = defineProps<{
  listing: ListingInterface.Listing
  exit: () => void
}>()

const category = ref<string>(props.listing.category)
const contractStartDate = ref<Date>(new Date(props.listing.contractStartDate))
const contractEndDate = ref<Date>(new Date(props.listing.contractEndDate))
const isPricePerWholeTime = ref<boolean>(props.listing.isPricePerWholeTime)
const price = ref<number>(
  props.listing.isPricePerWholeTime ? props.listing.pricePerWholeTime : props.listing.pricePerMonth
)
const numberOfRooms = ref<number>(props.listing.numberOfRooms)
const location = ref<SavedGeoCodeGoogleLocation | null>({ ...props.listing.coordinates })
const images = ref<string[]>([...props.listing.images])
const title = ref<string>(props.listing.title)
const description = ref<string>(props.listing.description)
const isAnimalFriendly = ref<boolean>(props.listing.isAnimalFriendly)
const isWithGardenOrPorch = ref<boolean>(props.listing.isWithGardenOrPorch)
const parkingSpaces = ref<number>(props.listing.parkingSpaces)

watch(contractStartDate, (newValue, oldValue) => {
  if (newValue) {
    if (!contractEndDate.value) {
      contractEndDate.value = new Date(new Date().setDate(newValue.getDate() + 365))
    } else if (oldValue) {
      // keep the relative difference between the dates
      const diff = contractEndDate.value.getTime() - oldValue.getTime()
      contractEndDate.value = new Date(newValue.getTime() + diff)
    }
  }
})

watch(category, (newCategory) => {
  if (newCategory === 'rent') {
    isPricePerWholeTime.value = false
  }
})

const resetFields = () => {
  category.value = props.listing.category
  contractStartDate.value = new Date(props.listing.contractStartDate)
  contractEndDate.value = new Date(props.listing.contractEndDate)
  isPricePerWholeTime.value = props.listing.isPricePerWholeTime
  price.value = props.listing.isPricePerWholeTime
    ? props.listing.pricePerWholeTime
    : props.listing.pricePerMonth
  numberOfRooms.value = props.listing.numberOfRooms
  location.value = { ...props.listing.coordinates }
  images.value = [...props.listing.images]
  title.value = props.listing.title
  description.value = props.listing.description
  isAnimalFriendly.value = props.listing.isAnimalFriendly
  isWithGardenOrPorch.value = props.listing.isWithGardenOrPorch
  parkingSpaces.value = props.listing.parkingSpaces
}

const resetForm = () => {
  resetFields()
  toast.add({
    severity: 'info',
    summary: 'Form Reset',
    detail: 'The form has been reset successfully',
    life: 3000
  })
}

const cancelForm = () => {
  resetFields()
  props.exit()
}

const addErrorToast = (whatIsRequired: string): boolean => {
  // a little hack to shorten validateForm
  toast.add({
    severity: 'error',
    summary: 'Error',
    detail: `${whatIsRequired} is required`,
    life: 3000
  })
  return false
}

const validateForm = () => {
  if (!title.value) {
    return addErrorToast('Title')
  }
  if (!description.value) {
    return addErrorToast('Description')
  }
  if (!contractStartDate.value) {
    return addErrorToast('Contract start date')
  }
  if (!contractEndDate.value) {
    return addErrorToast('Contract end date')
  }
  if (contractStartDate.value.getTime() > contractEndDate.value.getTime()) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Contract start date must be before contract end date',
      life: 3000
    })
    return false
  }
  if (!price.value) {
    return addErrorToast('Price')
  }
  if (!numberOfRooms.value) {
    return addErrorToast('Number of rooms')
  }
  if (!location.value) {
    return addErrorToast('Location')
  }
  if (images.value.length === 0) {
    return addErrorToast('At least one image is required')
  }
  return true
}

const formatDate = (isoDate: Date): string => {
  // TODO: put somewhere else
  return isoDate.toISOString().split('T')[0]
}

const arraysEqual = (a: any[], b: any[]): boolean => {
  return a.length === b.length && a.every((val, index) => val === b[index])
}

const constructPayload = (): Partial<ListingPayload> => {
  const payload: Partial<ListingPayload> = {}

  // take only the fields that have changed
  if (category.value !== props.listing.category) payload.category = category.value
  if (contractStartDate.value.getTime() !== new Date(props.listing.contractStartDate).getTime())
    payload.contractStartDate = formatDate(contractStartDate.value)
  if (contractEndDate.value.getTime() !== new Date(props.listing.contractEndDate).getTime())
    payload.contractEndDate = formatDate(contractEndDate.value)
  if (isPricePerWholeTime.value !== props.listing.isPricePerWholeTime)
    payload.isPricePerWholeTime = isPricePerWholeTime.value
  const priceValue = isPricePerWholeTime.value
    ? props.listing.pricePerWholeTime
    : props.listing.pricePerMonth
  if (price.value !== priceValue) payload.price = price.value
  if (numberOfRooms.value !== props.listing.numberOfRooms)
    payload.numberOfRooms = numberOfRooms.value
  if (JSON.stringify(location.value) !== JSON.stringify(props.listing.coordinates))
    payload.coordinates = location.value as SavedGeoCodeGoogleLocation
  if (!arraysEqual(images.value, props.listing.images)) payload.images = images.value
  if (title.value !== props.listing.title) payload.title = title.value
  if (description.value !== props.listing.description) payload.description = description.value
  if (isAnimalFriendly.value !== props.listing.isAnimalFriendly)
    payload.isAnimalFriendly = isAnimalFriendly.value
  if (isWithGardenOrPorch.value !== props.listing.isWithGardenOrPorch)
    payload.isWithGardenOrPorch = isWithGardenOrPorch.value
  if (parkingSpaces.value !== props.listing.parkingSpaces)
    payload.parkingSpaces = parkingSpaces.value

  return payload
}

const saveForm = async () => {
  if (!validateForm()) return

  const payload = constructPayload()

  if (Object.keys(payload).length === 0) {
    toast.add({
      severity: 'info',
      summary: 'No Changes',
      detail: 'No changes were made to the listing',
      life: 3000
    })
    return
  }

  try {
    await API.updateListing(props.listing.listingId, payload)
    toast.add({
      severity: 'success',
      summary: 'Listing Updated',
      detail: 'The listing has been updated successfully',
      life: 3000
    })
    // TODO: upload photos to S3
    props.exit()
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 3000
    })
  }
}
</script>
