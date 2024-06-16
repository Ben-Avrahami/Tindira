<template>
  <Stepper v-model:activeStep="active">
    <StepperPanel>
      <template #header="{ index }">
        <StepperIcon :icon="'mdi:star'" :colorize="index <= active" />
      </template>
      <template #content="{ nextCallback }">
        <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 24rem">
          <StepperTitle title="Let's add a new listing!" />
          <div class="flex flex-row justify-center gap-4">
            <ToggleRole
              icon="mdi:home-city"
              description="Add apartment for rent"
              :role="isRent === true"
              :toggleRole="() => (isRent = true)"
            />
            <ToggleRole
              icon="mdi:home-clock"
              description="Add apartment for sublet"
              :role="isRent === false"
              :toggleRole="() => (isRent = false)"
            />
          </div>
        </div>
        <div class="flex pt-4 justify-between">
          <Button label="Cancel" severity="secondary" @click="() => router.push('/')" />
          <NextButton
            :disabled="isRent === null"
            @click="
                (event: Event) => {
                  if (validateListingType()) {
                    if (isRent === true) {
                      isPricePerMonth = true // rent is always price per month
                    }
                    nextCallback(event)
                  }
                }
              "
          />
        </div>
      </template>
    </StepperPanel>
    <StepperPanel>
      <template #header="{ index }">
        <StepperIcon :icon="'mdi:house'" :colorize="index <= active" />
      </template>
      <template #content="{ prevCallback, nextCallback }">
        <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 20rem">
          <StepperTitle :title="`Adding an apartment for ${isRent ? 'rent' : 'sublet'}!`" />
          <InputGroup class="mb-4">
            <Calendar
              class="w-full"
              v-model="startDate"
              placeholder="Starting Date"
              showIcon
              showButtonBar
            />
          </InputGroup>
          <InputGroup class="mb-4">
            <Calendar
              class="w-full"
              v-model="endDate"
              placeholder="Ending Date"
              showIcon
              showButtonBar
            />
          </InputGroup>
          <InputGroup class="mb-4">
            <InputNumber
              inputId="rooms"
              v-model="rooms"
              mode="decimal"
              showButtons
              :min="1"
              :max="ListingInterface.MAX_ROOMS"
              :suffix="rooms === null ? '' : rooms > 1 ? ' rooms' : ' room'"
              placeholder="Number of rooms"
            />
          </InputGroup>
          <InputGroup v-if="!isRent" class="mb-4 flex flex-col">
            <div class="mb-2 flex items-center">
              <RadioButton inputId="price" v-model="isPricePerMonth" :value="true" />
              <label for="price" class="ml-2">Price is per month</label>
            </div>
            <div class="flex items-center">
              <RadioButton inputId="pricePerPeriod" v-model="isPricePerMonth" :value="false" />
              <label for="pricePerPeriod" class="ml-2">Price is per whole period</label>
            </div>
          </InputGroup>
          <InputGroup class="mb-4">
            <InputNumber
              class="w-full"
              inputId="price"
              v-model="price"
              mode="currency"
              currency="ILS"
              locale="he-IL"
              currencyDisplay="symbol"
              :placeholder="isPricePerMonth ? 'Price per month' : 'Price per whole period'"
            />
            <InputGroupAddon>
              <Icon icon="mdi:cash-multiple" />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div class="flex pt-4 justify-between">
          <BackButton @click="prevCallback" />
          <NextButton
            :disabled="!price || !startDate || !endDate || !rooms"
            @click="
                (event: Event) => {
                  if (validateBasicInfo()) {
                    nextCallback(event)
                  }
                }
              "
          />
        </div>
      </template>
    </StepperPanel>
    <StepperPanel>
      <template #header="{ index }">
        <StepperIcon :icon="'mdi:map'" :colorize="index <= active" />
      </template>
      <template #content="{ prevCallback, nextCallback }">
        <div
          class="flex flex-col gap-2 mx-auto relative"
          style="min-height: 16rem; max-width: 24rem"
        >
          <StepperTitle title="Where is the apartment located?" />
          <label for="selected-address" class="text-sm text-gray-500">
            Start typing an address to get suggestions
          </label>
          <GoogleMapsAutoComplete
            :locationChosen="(loc: SavedGeoCodeGoogleLocation) => location = loc"
            :locationCleared="() => (location = null)"
          />
          <GoogleMap :center="location?.geometry.location" />
        </div>
        <div class="flex pt-4 justify-between">
          <BackButton @click="prevCallback" />
          <NextButton
            :disabled="!location"
            @click="
                (event: Event) => {
                  if (validateLocation()) {
                    nextCallback(event)
                  }
                }
              "
          />
        </div>
      </template>
    </StepperPanel>
    <StepperPanel>
      <template #header="{ index }">
        <StepperIcon :icon="'mdi:camera'" :colorize="index <= active" />
      </template>
      <template #content="{ prevCallback, nextCallback }">
        <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 24rem">
          <StepperTitle title="How does the apartment look like?" />
          <ListingImages :images="photosManager.getAllPhotosUrls()" :removeImage :addImage />
        </div>
        <div class="flex pt-4 justify-between">
          <BackButton @click="prevCallback" />
          <NextButton
            :disabled="!photos.length"
            @click="
                (event: Event) => {
                  if (validatePhotos()) {
                    nextCallback(event)
                  }
                }
              "
          />
        </div>
      </template>
    </StepperPanel>
    <StepperPanel>
      <template #header="{ index }">
        <StepperIcon :icon="'mdi:pencil'" :colorize="index <= active" />
      </template>
      <template #content="{ prevCallback, nextCallback }">
        <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 24rem">
          <StepperTitle title="What else?" />
          <InputGroup>
            <InputText inputId="title" v-model="title" type="text" placeholder="Title" />
            <InputGroupAddon>
              <Icon icon="mdi:house" />
            </InputGroupAddon>
          </InputGroup>
          <InputGroup class="flex flex-col w-full relative">
            <Textarea
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
          <InputGroup>
            <InputNumber
              inputId="parking"
              v-model="parkingSpots"
              mode="decimal"
              showButtons
              :min="0"
              :max="ListingInterface.MAX_PARKING_SPOTS"
              :suffix="parkingSpots === 1 ? ' parking spot' : ' parking spots'"
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
        </div>
        <div class="flex pt-4 justify-between">
          <BackButton @click="prevCallback" />
          <NextButton
            :disabled="!title || !description"
            @click="
                (event: Event) => {
                  if (validateAdditionalInfo()) {
                    nextCallback(event)
                  }
                }
              "
          />
        </div>
      </template>
    </StepperPanel>
    <StepperPanel>
      <template #header="{ index }">
        <StepperIcon :icon="'mdi:check'" :colorize="index <= active" />
      </template>
      <template #content="{ prevCallback }">
        <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 24rem">
          <StepperTitle title="The listing is ready to upload!" />
          <div class="flex justify-center">
            <img alt="logo" src="https://primefaces.org/cdn/primevue/images/stepper/content.svg" />
          </div>
        </div>
        <div class="flex pt-4 justify-between">
          <BackButton @click="prevCallback" />
          <Button label="Upload" @click="sendUploadRequest" />
        </div>
      </template>
    </StepperPanel>
  </Stepper>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import { Icon } from '@iconify/vue/dist/iconify.js'
import { useRouter } from 'vue-router'
import { injectToast } from '@/functions/inject'
import { useAppStore } from '@/stores/app'

import NextButton from '@/components/signup/NextButton.vue'
import BackButton from '@/components/signup/BackButton.vue'
import StepperIcon from '@/components/signup/StepperIcon.vue'
import StepperTitle from '@/components/signup/StepperTitle.vue'
import ListingImages from '@/components/misc/listing_form/ListingImages.vue'
import ToggleRole from '@/components/signup/ToggleRole.vue'
import GoogleMap from '@/components/misc/google_maps/GoogleMap.vue'

import API from '@/api'
import type { ListingPayload } from '@/api'
import * as ListingInterface from '@/interfaces/listing.interface'
import GoogleMapsAutoComplete from '@/components/misc/google_maps/GoogleMapsAutoComplete.vue'
import type { SavedGeoCodeGoogleLocation } from '@/interfaces/geolocation.interface'
import { uploadImagesToS3 } from '@/functions/aws'
import { type Photo, PhotosManager } from '@/functions/photosManager'

const router = useRouter()

const toast = injectToast()

const active = ref<number>(0)

const store = useAppStore()

// ==== Rent / Sublet Panel ==== //

const isRent = ref<boolean | null>(null)

const validateListingType = (): boolean => {
  if (isRent.value === null) {
    toast.add({
      severity: 'error',
      summary: 'No Listing Type Selected',
      detail: 'Please select a listing type',
      life: 3000
    })
    return false
  }
  return true
}

// ==== Basic Information Panel ==== //

const startDate = ref<Date | null>(null)
const endDate = ref<Date | null>(null)
const isPricePerMonth = ref<boolean>(false)
const price = ref<number | null>(null)
const rooms = ref<number | null>(null)

watch(startDate, (newValue, oldValue) => {
  if (newValue) {
    if (!endDate.value) {
      endDate.value = new Date(new Date().setDate(newValue.getDate() + 365))
    } else if (oldValue) {
      // keep the relative difference between the dates
      const diff = endDate.value.getTime() - oldValue.getTime()
      endDate.value = new Date(newValue.getTime() + diff)
    }
  }
})

const isPriceValid = (): boolean => {
  console.log(startDate.value)
  return price.value !== null && price.value > 0
}

const validateBasicInfo = (): boolean => {
  if (!startDate.value || !endDate.value) {
    toast.add({
      severity: 'error',
      summary: 'Missing Dates',
      detail: 'Please select a starting and ending date',
      life: 3000
    })
    return false
  }
  if (startDate.value >= endDate.value) {
    toast.add({
      severity: 'error',
      summary: 'Invalid Dates',
      detail: 'The starting date must be before the ending date',
      life: 3000
    })
    return false
  }
  if (!isPriceValid()) {
    toast.add({
      severity: 'error',
      summary: 'Invalid Price',
      detail: 'Please enter a valid price',
      life: 3000
    })
    return false
  }
  return true
}

// ==== Location Panel ==== //

const location = ref<SavedGeoCodeGoogleLocation | null>(null)
let coordinates: SavedGeoCodeGoogleLocation | null = null

const validateLocation = (): boolean => {
  if (!location.value) {
    toast.add({
      severity: 'error',
      summary: 'Missing Location',
      detail: 'Please select a location',
      life: 3000
    })
    return false
  }

  coordinates = JSON.parse(JSON.stringify(location.value))

  // Manual validation of the location object structure to match backend requirements
  const isValidLocation =
    coordinates!.formatted_address &&
    typeof coordinates!.formatted_address === 'string' &&
    coordinates!.geometry &&
    coordinates!.geometry.location &&
    typeof coordinates!.geometry.location.lat === 'number' &&
    typeof coordinates!.geometry.location.lng === 'number' &&
    coordinates!.geometry.viewport &&
    typeof coordinates!.geometry.viewport.east === 'number' &&
    typeof coordinates!.geometry.viewport.north === 'number' &&
    typeof coordinates!.geometry.viewport.south === 'number' &&
    typeof coordinates!.geometry.viewport.west === 'number' &&
    coordinates!.place_id &&
    typeof coordinates!.place_id === 'string'

  if (!isValidLocation) {
    toast.add({
      severity: 'error',
      summary: 'Invalid Location',
      detail: 'The location data is incomplete or incorrectly formatted',
      life: 3000
    })
    return false
  }

  return true
}

// ==== Photos Panel ==== //

const photos = ref<Photo[]>([])
const photosManager = new PhotosManager(photos)

const addImage = (image: File) => {
  photosManager.addPhotoFile(image)
}

const removeImage = (url: string) => {
  photosManager.removePhoto(url)
}

const validatePhotos = (): boolean => {
  if (!photos.value.length) {
    toast.add({
      severity: 'error',
      summary: 'No Photos',
      detail: 'Please upload at least one photo',
      life: 3000
    })
    return false
  }
  return true
}

// ==== Additional Information Panel ==== //

const title = ref<string>('')
const description = ref<string>('')

const isAnimalFriendly = ref<boolean>(false)
const isWithGardenOrPorch = ref<boolean>(false)
const parkingSpots = ref<number>(0)

const validateAdditionalInfo = (): boolean => {
  if (!title.value.length) {
    toast.add({
      severity: 'error',
      summary: 'Missing Information',
      detail: "Please add listing's title",
      life: 3000
    })
    return false
  }
  if (!description.value.length) {
    toast.add({
      severity: 'error',
      summary: 'Missing Information',
      detail: "Please add listing's description",
      life: 3000
    })
    return false
  }
  if (description.value.length > ListingInterface.MAX_DESCRIPTION_LENGTH) {
    toast.add({
      severity: 'error',
      summary: 'Description is too long',
      detail: `Please keep the description under ${ListingInterface.MAX_DESCRIPTION_LENGTH} characters`,
      life: 3000
    })
    return false
  }
  return true
}

// ==== Send sign-up request to backend ==== //

const formatDate = (isoDate: Date): string => {
  return isoDate.toISOString().split('T')[0]
}

const sendUploadRequest = async () => {
  if (
    !startDate.value ||
    !endDate.value ||
    !price.value ||
    !rooms.value ||
    !coordinates ||
    !store.connectedUser
  ) {
    // This should never happen because the NextButton is disabled, but just in case
    return
  }
  console.log('coordinates: ', coordinates)
  const payload: ListingPayload = {
    category: isRent.value ? 'rent' : 'sublet',
    contractStartDate: formatDate(startDate.value),
    contractEndDate: formatDate(endDate.value),
    postExpireDate: isRent.value
      ? formatDate(new Date(new Date().setDate(new Date().getDate() + 365)))
      : formatDate(endDate.value),
    postUploadDate: formatDate(new Date()),
    description: description.value,
    isAnimalFriendly: isAnimalFriendly.value,
    ownerId: store.connectedUser,
    price: price.value,
    title: title.value,
    isWithGardenOrPorch: isWithGardenOrPorch.value,
    parkingSpaces: parkingSpots.value,
    numberOfRooms: rooms.value,
    isPricePerWholeTime: !isPricePerMonth.value,
    coordinates: {
      formatted_address: coordinates.formatted_address,
      geometry: {
        location: coordinates.geometry.location,
        viewport: coordinates.geometry.viewport
      },
      place_id: coordinates.place_id
    }
  }
  try {
    const response = await API.postListing(payload)
    toast.add({
      severity: 'success',
      summary: 'Listing Uploaded',
      detail: 'Your listing has been uploaded successfully!',
      life: 3000
    })
    console.log('response: ', response)
    uploadImages(response.data.listingId)
    router.push('/')
  } catch (error: any) {
    console.log(error)
    toast.add({
      severity: 'error',
      summary: 'Upload Failed',
      detail: error?.response?.data ?? "Couldn't upload the listing :(",
      life: 3000
    })
  }
}

const uploadImages = async (listingId: string): Promise<void> => {
  const path = `listings/${listingId}`
  const files = photosManager.getFiles()
  const { urls, errors } = await uploadImagesToS3(files, path)
  errors.forEach((error) => {
    toast.add({
      severity: 'error',
      summary: 'Listing Image Upload Failed',
      detail: error,
      life: 3000
    })
  })

  if (urls.length) {
    try {
      await API.updateListing(listingId, {
        images: urls
      })
    } catch (error: any) {
      console.log(error)
      toast.add({
        severity: 'error',
        summary: 'Listing Image Upload Failed',
        detail: error?.response?.body ?? "Couldn't upload the listing's images :(",
        life: 3000
      })
    }
  }
}
</script>

<style scoped></style>
