<template>
  <Stepper v-model:activeStep="active">
    <StepperPanel>
      <template #header="{ index }">
        <StepperIcon :icon="'mdi:user'" :colorize="index <= active" />
      </template>
      <template #content="{ nextCallback }">
        <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 20rem">
          <StepperTitle title="Let's create your account!" />
          <div class="mb-4">
            <IconField>
              <InputIcon>
                <Icon icon="mdi:phone" />
              </InputIcon>
              <InputMask
                id="phone"
                v-model="phone"
                mask="059-999-9999"
                placeholder="05X-XXX-XXXX"
              />
            </IconField>
          </div>
          <div class="mb-4">
            <IconField>
              <InputIcon>
                <Icon icon="mdi:user" />
              </InputIcon>
              <InputText id="name" v-model="name" type="text" placeholder="Full Name" />
            </IconField>
          </div>
          <div class="mb-4">
            <IconField>
              <InputIcon>
                <Icon icon="mdi:email" />
              </InputIcon>
              <InputText id="email" v-model="email" type="email" placeholder="Email" />
            </IconField>
          </div>
          <div class="mb-4">
            <IconField>
              <InputIcon v-if="!username">
                <Icon icon="mdi:rename" />
              </InputIcon>
              <InputIcon v-else-if="fetchingUsernameTaken">
                <ProgressSpinner
                  style="width: 18px; height: 18px; filter: brightness(0.7) sepia(1)"
                  strokeWidth="8"
                />
              </InputIcon>
              <InputIcon v-else-if="usernameTaken">
                <Icon icon="mdi:close" class="text-red-500" />
              </InputIcon>
              <InputIcon v-else>
                <Icon icon="mdi:check" class="text-green-500" />
              </InputIcon>
              <InputText id="username" v-model="username" type="text" placeholder="Username" />
            </IconField>
          </div>
          <div class="mb-4">
            <Password v-model="password" toggleMask placeholder="Password" class="w-full">
              <template #footer>
                <Divider />
                <p class="mt-2 p-0 mb-2">Requirements</p>
                <ul class="p-0 pl-2 m-0 ml-2 list-disc leading-6" style="line-height: 1.5">
                  <li
                    :class="{
                      'text-green-500': password && /[a-z]/.test(password)
                    }"
                  >
                    At least one lowercase
                  </li>
                  <li
                    :class="{
                      'text-green-500': password && /[A-Z]/.test(password)
                    }"
                  >
                    At least one uppercase
                  </li>
                  <li :class="{ 'text-green-500': password && /\d/.test(password) }">
                    At least one digit
                  </li>
                  <li
                    :class="{
                      'text-green-500': password && password.length >= 8
                    }"
                  >
                    Minimum 8 characters
                  </li>
                </ul>
              </template>
            </Password>
          </div>
        </div>
        <div class="flex pt-4 justify-between">
          <Button label="To Login" severity="secondary" @click="() => router.push('/login')" />
          <NextButton
            :disabled="!(phone && name && username && email && password)"
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
        <StepperIcon :icon="'mdi:camera'" :colorize="index <= active" />
      </template>
      <template #content="{ prevCallback, nextCallback }">
        <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 24rem">
          <StepperTitle title="Upload your profile picture" optional />
          <div class="flex justify-center">
            <ProfilePicture
              :profilePicture="photosManager.getAllPhotosUrls()[0] || null"
              :setProfilePicture
              :clearProfilePicture
            />
          </div>
        </div>
        <div class="flex pt-4 justify-between">
          <BackButton @click="prevCallback" />
          <NextButton @click="nextCallback" />
        </div>
      </template>
    </StepperPanel>
    <StepperPanel>
      <template #header="{ index }">
        <StepperIcon :icon="'mdi:pencil'" :colorize="index <= active" />
      </template>
      <template #content="{ prevCallback, nextCallback }">
        <div
          class="flex flex-col gap-2 mx-auto relative"
          style="min-height: 16rem; max-width: 24rem"
        >
          <StepperTitle title="Tell us a bit about yourself!" optional />
          <Textarea
            v-model="description"
            rows="10"
            cols="30"
            autoResize
            :maxlength="MAX_DESCRIPTION_LENGTH"
          />
          <div class="absolute bottom-0 right-0 mb-4 mr-4 text-sm text-gray-500">
            {{ description.length }}/{{ MAX_DESCRIPTION_LENGTH }}
          </div>
        </div>
        <div class="flex pt-4 justify-between">
          <BackButton @click="prevCallback" />
          <NextButton @click="nextCallback" />
        </div>
      </template>
    </StepperPanel>
    <StepperPanel>
      <template #header="{ index }">
        <StepperIcon :icon="'mdi:star'" :colorize="index <= active" />
      </template>
      <template #content="{ prevCallback, nextCallback }">
        <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 24rem">
          <StepperTitle title="Select at least one" />
          <div class="flex flex-row justify-center gap-4">
            <ToggleRole
              icon="mdi:home-search"
              description="I want to search an apartment"
              :role="rent"
              :toggleRole="() => (rent = !rent)"
            />
            <ToggleRole
              icon="mdi:home-city"
              description="I want to post an apartment"
              :role="lease"
              :toggleRole="() => (lease = !lease)"
            />
          </div>
        </div>
        <div class="flex pt-4 justify-between">
          <BackButton @click="prevCallback" />
          <NextButton
            :disabled="!(rent || lease)"
            @click="
                (event: Event) => {
                  if (validateRoles()) {
                    prepareSignUpPanel()
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
        <div class="flex flex-col gap-2 mx-auto">
          <StepperTitle title="You're all set!" />
          <UserBusinessCard v-if="userObject" :user="userObject" />
        </div>
        <div class="flex pt-4 justify-between">
          <BackButton @click="prevCallback" />
          <Button
            :label="submitting ? 'Wait...' : 'Sign Up!'"
            @click="disableSignUpButtonAndSubmit"
            :disabled="submitting"
          />
        </div>
      </template>
    </StepperPanel>
  </Stepper>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue/dist/iconify.js'
import { useRouter } from 'vue-router'
import { injectToast } from '@/functions/inject'
import { useAppStore } from '@/stores/app'

import NextButton from '@/components/signup/NextButton.vue'
import BackButton from '@/components/signup/BackButton.vue'
import StepperIcon from '@/components/signup/StepperIcon.vue'
import StepperTitle from '@/components/signup/StepperTitle.vue'
import ProfilePicture from '@/components/signup/ProfilePicture.vue'
import ToggleRole from '@/components/signup/ToggleRole.vue'
import UserBusinessCard from '@/components/misc/user_form/UserBusinessCard.vue'

import { uploadImagesToS3 } from '@/functions/aws'
import { type Photo, PhotosManager } from '@/functions/photosManager'
import type { SavedUser } from '@/stores/State.interface'

import API from '@/api'

const store = useAppStore()

const router = useRouter()

const toast = injectToast()

const active = ref<number>(0)

// ==== Basic Information Panel ==== //

const phone = ref<string>('')
const name = ref<string>('')
const username = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')

const USERNAME_MIN_LENGTH = 4

const usernameTaken = ref<boolean>(false)
const fetchingUsernameTaken = ref<boolean>(false)
let timeoutId: NodeJS.Timeout | undefined
const IS_USERNAME_AVAILABLE_DELAY = 800

watch(username, (newUsername) => {
  if (timeoutId !== undefined) {
    clearTimeout(timeoutId)
  }
  fetchingUsernameTaken.value = true
  timeoutId = setTimeout(async () => {
    if (newUsername) {
      const isUsernameTaken = await API.isUsernameTaken(newUsername)
      usernameTaken.value = isUsernameTaken || !isUsernameValid(newUsername)
      fetchingUsernameTaken.value = false
    }
  }, IS_USERNAME_AVAILABLE_DELAY)
})

const isPhoneValid = (): boolean => {
  return !!phone.value && phone.value.trim().length === 12
}

const isNameValid = (): boolean => {
  return !!name.value && name.value.trim().split(/\s+/).length === 2
}

const isUsernameValid = (username: string): boolean => {
  return (
    !!username &&
    !username.includes(' ') &&
    !(username.trim().length < USERNAME_MIN_LENGTH) &&
    !(username.length > 20) &&
    !!/^[a-z0-9_]*$/.test(username)
  )
}

const validateUsername = (): boolean => {
  // TODO: Implement username validation through API
  const SUMMARY = 'Invalid Username'
  if (!username.value) {
    toast.add({
      severity: 'error',
      summary: SUMMARY,
      detail: 'Please enter a username',
      life: 3000
    })
    return false
  }
  if (username.value.includes(' ')) {
    toast.add({
      severity: 'error',
      summary: SUMMARY,
      detail: 'Username must not include spaces',
      life: 3000
    })
    return false
  }
  if (username.value.length < USERNAME_MIN_LENGTH) {
    toast.add({
      severity: 'error',
      summary: SUMMARY,
      detail: `Username must be at least ${USERNAME_MIN_LENGTH} characters`,
      life: 3000
    })
    return false
  }
  if (username.value.length > 20) {
    toast.add({
      severity: 'error',
      summary: SUMMARY,
      detail: 'Username must be at most 20 characters',
      life: 3000
    })
    return false
  }
  if (!/^[a-z0-9_]*$/.test(username.value)) {
    toast.add({
      severity: 'error',
      summary: SUMMARY,
      detail: 'Username must only include small letters, numbers, and underscores',
      life: 3000
    })
    return false
  }
  return true
}

const isEmailValid = (): boolean => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return regex.test(email.value)
}

const isPasswordStrong = (): boolean => {
  // At least one lowercase, one uppercase, one digit, and minimum 8 characters
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&]{8,}$/
  // Note: The regex above does not exactly match PrimeVue's regex, which can cause buggy behavior
  return regex.test(password.value)
}

const validateBasicInfo = (): boolean => {
  if (!isPhoneValid()) {
    toast.add({
      severity: 'error',
      summary: 'Invalid Phone Number',
      detail: 'Please enter a valid phone number',
      life: 3000
    })
    return false
  }
  if (!isNameValid()) {
    toast.add({
      severity: 'error',
      summary: 'Invalid Name',
      detail: 'Please enter your full name',
      life: 3000
    })
    return false
  }
  if (!validateUsername()) {
    return false
  }
  if (usernameTaken.value) {
    toast.add({
      severity: 'error',
      summary: 'Username Taken',
      detail: 'Please choose a different username',
      life: 3000
    })
    return false
  }
  if (!isEmailValid()) {
    toast.add({
      severity: 'error',
      summary: 'Invalid Email',
      detail: 'Please enter a valid email address',
      life: 3000
    })
    return false
  }
  if (!isPasswordStrong()) {
    toast.add({
      severity: 'error',
      summary: 'Weak Password',
      detail: 'Please enter a strong password',
      life: 3000
    })
    return false
  }
  return true
}

// ==== Profile Picture Panel ==== //

const photos = ref<Photo[]>([])
const photosManager = new PhotosManager(photos)
const DEFAULT_AVATAR = 'https://tindira.s3.us-east-2.amazonaws.com/avatar-placeholder.png'

const clearProfilePicture = () => {
  photosManager.resetPhotos()
}

const setProfilePicture = (file: File) => {
  photosManager.resetPhotos()
  photosManager.addPhotoFile(file)
  uploadProfilePicture().then((profilePictureUrl) => {
    photosManager.resetPhotos()
    photosManager.addPhotosUrls([profilePictureUrl])
  }) // lazy upload
}

// ==== Profile Description Panel ==== //

const description = ref<string>('')
const MAX_DESCRIPTION_LENGTH = 500

// ==== Interests Panel ==== //

const rent = ref<boolean>(false)
const lease = ref<boolean>(false)

const validateRoles = (): boolean => {
  if (!rent.value && !lease.value) {
    toast.add({
      severity: 'error',
      summary: 'No Role Selected',
      detail: 'Please select at least one role',
      life: 3000
    })
    return false
  }
  return true
}

const prepareSignUpPanel = () => {
  userObject.value = {
    email: email.value,
    fullName: name.value,
    username: username.value,
    phoneNumber: phone.value,
    roles: [...(rent.value ? ['renter'] : []), ...(lease.value ? ['lessor'] : [])],
    profilePicture: photos.value.length ? photos.value[0].url : DEFAULT_AVATAR,
    profileDescription: description.value,
    listings: []
  }
}

// ==== Send sign-up request to backend ==== //

const userObject = ref<SavedUser | null>(null)
const submitting = ref<boolean>(false)

const uploadProfilePicture = async (): Promise<string> => {
  if (!photos.value.length) {
    return DEFAULT_AVATAR
  }

  const path = `users/${username.value}`
  const file = photos.value[0].file!
  const { urls, errors } = await uploadImagesToS3([file], path)
  if (errors.length > 0) {
    toast.add({
      severity: 'error',
      summary: 'Profile Picture Upload Failed',
      detail: errors[0],
      life: 3000
    })
    return DEFAULT_AVATAR
  }
  return urls[0]
}

const disableSignUpButtonAndSubmit = async () => {
  submitting.value = true
  await sendSignUpRequest()
  submitting.value = false
}

const sendSignUpRequest = async () => {
  if (
    !phone.value ||
    !name.value ||
    !email.value ||
    !password.value ||
    !(rent.value || lease.value)
  ) {
    // This should never happen because the NextButton is disabled, but just in case
    toast.add({
      severity: 'error',
      summary: 'Missing Information',
      detail: 'Please fill in all required fields',
      life: 3000
    })
    return
  }

  if (!userObject.value) {
    toast.add({
      severity: 'error',
      summary: 'An Error Occurred',
      detail: 'Please refresh and try again',
      life: 3000
    })
    return
  }

  try {
    await API.registerUser(
      userObject.value.username,
      userObject.value.email,
      userObject.value.fullName,
      password.value,
      userObject.value.phoneNumber,
      userObject.value.roles,
      userObject.value.profilePicture,
      userObject.value.profileDescription
    )
    toast.add({
      severity: 'success',
      summary: 'Sign Up Successful',
      detail: 'You have successfully signed up!',
      life: 3000
    })

    await store.connectUser(userObject.value.username, userObject.value)
    await router.push('/')
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Sign Up Failed',
      detail: error.response.data.message,
      life: 3000
    })
  }
}
</script>

<style scoped></style>
