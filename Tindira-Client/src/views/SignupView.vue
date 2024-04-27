<template>
  <div class="card flex justify-center">
    <Toast />
    <Stepper v-model:activeStep="active">
      <StepperPanel>
        <template #header="{ index, clickCallback }">
          <StepperIcon :icon="'mdi:user'" :colorize="index <= active" @click="clickCallback" />
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
                <InputText id="input" v-model="name" type="text" placeholder="Name" />
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
          <div class="flex pt-4 justify-end">
            <NextButton
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
        <template #header="{ index, clickCallback }">
          <StepperIcon :icon="'mdi:camera'" :colorize="index <= active" @click="clickCallback" />
        </template>
        <template #content="{ prevCallback, nextCallback }">
          <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 24rem">
            <StepperTitle title="Upload your profile picture" optional />
            <div class="flex justify-center">
              <!-- <FileUpload name="profilePicture" accept="image/*" @upload="handleFileUpload" /> -->
              <!-- <input type="file" @change="handleFileUpload" accept="image/*" /> -->
              <ProfilePicture :profilePicture :setProfilePicture :toast />
            </div>
          </div>
          <div class="flex pt-4 justify-between">
            <BackButton @click="prevCallback" />
            <NextButton @click="nextCallback" />
          </div>
        </template>
      </StepperPanel>
      <StepperPanel>
        <template #header="{ index, clickCallback }">
          <StepperIcon :icon="'mdi:star'" :colorize="index <= active" @click="clickCallback" />
        </template>
        <template #content="{ prevCallback, nextCallback }">
          <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 24rem">
            <StepperTitle title="Select your interests" />
            <div class="flex flex-wrap justify-center gap-3">
              <ToggleButton v-model="option1" onLabel="Nature" offLabel="Nature" />
              <ToggleButton v-model="option2" onLabel="Art" offLabel="Art" />
              <ToggleButton v-model="option3" onLabel="Music" offLabel="Music" />
              <ToggleButton v-model="option4" onLabel="Design" offLabel="Design" />
              <ToggleButton v-model="option5" onLabel="Photography" offLabel="Photography" />
              <ToggleButton v-model="option6" onLabel="Movies" offLabel="Movies" />
              <ToggleButton v-model="option7" onLabel="Sports" offLabel="Sports" />
              <ToggleButton v-model="option8" onLabel="Gaming" offLabel="Gaming" />
              <ToggleButton v-model="option9" onLabel="Traveling" offLabel="Traveling" />
              <ToggleButton v-model="option10" onLabel="Dancing" offLabel="Dancing" />
            </div>
          </div>
          <div class="flex pt-4 justify-between">
            <BackButton @click="prevCallback" />
            <NextButton @click="nextCallback" />
          </div>
        </template>
      </StepperPanel>
      <StepperPanel>
        <template #header="{ index, clickCallback }">
          <StepperIcon :icon="'mdi:check'" :colorize="index <= active" @click="clickCallback" />
        </template>
        <template #content="{ prevCallback }">
          <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 24rem">
            <StepperTitle title="You're all set!" />
            <div class="flex justify-center">
              <img
                alt="logo"
                src="https://primefaces.org/cdn/primevue/images/stepper/content.svg"
              />
            </div>
          </div>
          <div class="flex pt-4 justify-start">
            <BackButton @click="prevCallback" />
          </div>
        </template>
      </StepperPanel>
    </Stepper>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue/dist/iconify.js'
import { useToast } from 'primevue/usetoast'

import NextButton from '@/components/signup/NextButton.vue'
import BackButton from '@/components/signup/BackButton.vue'
import StepperIcon from '@/components/signup/StepperIcon.vue'
import StepperTitle from '@/components/signup/StepperTitle.vue'
import ProfilePicture from '@/components/signup/ProfilePicture.vue'

const toast = useToast()

const active = ref(0)
const completed = ref(false)
const products = ref()
const option1 = ref(false)
const option2 = ref(false)
const option3 = ref(false)
const option4 = ref(false)
const option5 = ref(false)
const option6 = ref(false)
const option7 = ref(false)
const option8 = ref(false)
const option9 = ref(false)
const option10 = ref(false)

// ==== Basic Information Panel ==== //

const phone = ref()
const name = ref()
const email = ref()
const password = ref()

const isPhoneValid = (): boolean => {
  return phone.value && phone.value.trim().length === 12
}

const isNameValid = (): boolean => {
  return name.value && name.value.trim().split(/\s+/).length === 2
}

const isEmailValid = (): boolean => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return regex.test(email.value)
}

const isPasswordStrong = (): boolean => {
  // At least one lowercase, one uppercase, one digit, and minimum 8 characters
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&~]{8,}$/
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

const profilePicture = ref<string | null>(null)

const setProfilePicture = (image: string | null) => {
  profilePicture.value = image
}
</script>

<style scoped>
.p-stepper {
  flex-basis: 40rem;
}
</style>
