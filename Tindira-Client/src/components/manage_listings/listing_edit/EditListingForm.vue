<template>
  <div class="flex flex-col gap-4 dark:text-white">
    <InputGroup class="flex flex-col">
      <div class="flex">
        <Button
          v-for="(option, index) in ListingInterface.categories"
          class="w-full"
          :key="index"
          :severity="category === option ? 'success' : 'secondary'"
          @click="category = option"
          :disabled="disabled || submitting"
        >
          {{ option }}
        </Button>
      </div>
    </InputGroup>
    <InputGroup class="flex flex-col">
      <label class="flex" for="title">Title</label>
      <div class="flex">
        <InputText
          id="title"
          v-model="title"
          type="text"
          placeholder="Title"
          :disabled="disabled || submitting"
        />
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
        :disabled="disabled || submitting"
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
        :disabled="disabled || submitting"
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
        :disabled="disabled || submitting"
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
        :disabled="disabled || submitting"
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
        :disabled="disabled || submitting"
      />
    </InputGroup>
    <InputGroup>
      <Checkbox
        inputId="animalFriendly"
        v-model="isAnimalFriendly"
        binary
        :disabled="disabled || submitting"
      />
      <label for="animalFriendly" class="ml-2 text-gray-500">
        The apartment is animal friendly 🐈
      </label>
    </InputGroup>
    <InputGroup>
      <Checkbox
        inputId="gardenOrPorch"
        v-model="isWithGardenOrPorch"
        binary
        :disabled="disabled || submitting"
      />
      <label for="gardenOrPorch" class="ml-2 text-gray-500">
        The apartment has a garden or porch 🌳
      </label>
    </InputGroup>
    <InputGroup v-if="category === 'sublet'" class="flex flex-col">
      <div class="mb-2 flex items-center">
        <RadioButton
          inputId="price"
          v-model="isPricePerWholeTime"
          :value="false"
          :disabled="disabled || submitting"
        />
        <label for="price" class="ml-2">Price is per month</label>
      </div>
      <div class="flex items-center">
        <RadioButton
          inputId="pricePerPeriod"
          v-model="isPricePerWholeTime"
          :value="true"
          :disabled="disabled || submitting"
        />
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
          :disabled="disabled || submitting"
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
        :disabled="disabled || submitting"
      />
      <GoogleMap :center="location?.geometry.location" />
    </InputGroup>
    <InputGroup class="flex flex-col">
      <label class="flex">Images</label>
      <ListingImages
        :username="listing.ownerId"
        :photosManager
        :editable="!(disabled || submitting)"
      />
    </InputGroup>
    <div v-if="!disabled">
      <Divider class="w-full" />
      <div class="flex flex-col">
        <label class="flex"></label>
        <div class="flex justify-end gap-4">
          <Button
            severity="secondary"
            label="Cancel"
            class="w-1/3"
            @click="cancelForm"
            :disabled="submitting"
          />
          <Button
            severity="secondary"
            label="Reset"
            class="w-1/3"
            @click="resetForm"
            :disabled="submitting"
          />
          <Button
            label="Save"
            class="w-1/3"
            @click="disableButtonsAndSubmit"
            :disabled="submitting"
          />
        </div>
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
import { type Photo, PhotosManager } from '@/functions/photosManager'
import { calculatePrices, formatDate } from '@/functions/listing'
import { useAppStore } from '@/stores/app'
import { arraysEqual } from '@/functions/util'

import GoogleMap from '@/components/misc/google_maps/GoogleMap.vue'
import GoogleMapsAutoComplete from '@/components/misc/google_maps/GoogleMapsAutoComplete.vue'
import ListingImages from '@/components/misc/listing_form/ListingImages.vue'

const store = useAppStore()

const toast = injectToast()

const props = defineProps<{
  listing: ListingInterface.Listing
  disabled?: boolean
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
const title = ref<string>(props.listing.title)
const description = ref<string>(props.listing.description)
const isAnimalFriendly = ref<boolean>(props.listing.isAnimalFriendly)
const isWithGardenOrPorch = ref<boolean>(props.listing.isWithGardenOrPorch)
const parkingSpaces = ref<number>(props.listing.parkingSpaces)

const photos = ref<Photo[]>([])
const photosManager = new PhotosManager(photos, [...props.listing.images])

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

watch(
  () => props.listing,
  () => {
    resetFields()
  },
  {
    deep: true
  }
)

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
  photosManager.reset([...props.listing.images])
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
  if (photos.value.length === 0) {
    return addErrorToast('At least one image is required')
  }
  return true
}

const constructPayload = async (): Promise<Partial<ListingInterface.Listing>> => {
  const payload: Partial<ListingInterface.Listing> = {}

  const formattedStartDate = formatDate(contractStartDate.value)
  const formattedEndDate = formatDate(contractEndDate.value)

  const [pricePerMonth, pricePerWholeTime] = calculatePrices(
    price.value,
    formattedStartDate,
    formattedEndDate,
    isPricePerWholeTime.value
  )

  // take only the fields that have changed
  if (category.value !== props.listing.category) payload.category = category.value
  if (contractStartDate.value.getTime() !== new Date(props.listing.contractStartDate).getTime())
    payload.contractStartDate = formattedStartDate
  if (contractEndDate.value.getTime() !== new Date(props.listing.contractEndDate).getTime())
    payload.contractEndDate = formattedEndDate
  if (isPricePerWholeTime.value !== props.listing.isPricePerWholeTime)
    payload.isPricePerWholeTime = isPricePerWholeTime.value
  const priceValue = isPricePerWholeTime.value
    ? props.listing.pricePerWholeTime
    : props.listing.pricePerMonth
  if (price.value !== priceValue) {
    payload.pricePerMonth = pricePerMonth
    payload.pricePerWholeTime = pricePerWholeTime
  }
  if (numberOfRooms.value !== props.listing.numberOfRooms)
    payload.numberOfRooms = numberOfRooms.value
  if (JSON.stringify(location.value) !== JSON.stringify(props.listing.coordinates))
    payload.coordinates = location.value as SavedGeoCodeGoogleLocation
  if (!arraysEqual(photosManager.get(), props.listing.images)) payload.images = photosManager.get()
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

const submitting = ref(false)

const disableButtonsAndSubmit = async () => {
  submitting.value = true
  await saveForm()
  submitting.value = false
}

const saveForm = async () => {
  if (!validateForm()) return

  const payload = await constructPayload()

  if (Object.keys(payload).length === 0) {
    toast.add({
      severity: 'info',
      summary: 'No Changes',
      detail: 'No changes were made to the listing',
      life: 3000
    })
    return
  }

  store.updateConnectedUserListing(props.listing.listingId, payload).catch((error) => {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 3000
    })
    resetFields()
    console.error(error)
  })

  photosManager
    .save(props.listing.listingId)
    .then(({ urls, errors }) => {
      if (errors.length) {
        toast.add({
          severity: 'error',
          summary: `Failed to upload ${errors.length} image(s)`,
          detail: errors.join(', '),
          life: 3000
        })
        console.error(`Failed to upload ${errors.length} image(s):`, errors)
      }
      if (urls) {
        store.updateConnectedUserListing(props.listing.listingId, { images: urls })
      }
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 3000
      })
    })

  props.exit()
}
</script>
