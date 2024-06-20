<template>
  <div class="flex flex-col text-center justify-center gap-5">
    <div class="flex flex-col">
      <Avatar :image="profilePicture" size="xlarge" shape="circle" class="mx-auto my-6" />
      <IconField>
        <InputIcon>
          <Icon icon="mdi:rename" />
        </InputIcon>
        <InputText id="username" v-model="username" type="text" placeholder="Username" disabled />
      </IconField>
    </div>
    <IconField>
      <InputIcon>
        <Icon icon="mdi:email" />
      </InputIcon>
      <InputText
        id="email"
        v-model="email"
        type="email"
        placeholder="Email"
        :invalid="!isEmailValid"
      />
    </IconField>
    <IconField>
      <InputIcon>
        <Icon icon="mdi:user" />
      </InputIcon>
      <InputText
        id="name"
        v-model="fullName"
        type="text"
        placeholder="Full Name"
        :invalid="!isNameValid"
      />
    </IconField>
    <IconField>
      <InputIcon>
        <Icon icon="mdi:phone" />
      </InputIcon>
      <InputMask
        id="phone"
        v-model="phoneNumber"
        mask="059-999-9999"
        placeholder="05X-XXX-XXXX"
        :invalid="!isPhoneValid"
      />
    </IconField>
    <div class="flex flex-col relative">
      <Textarea
        class="w-full"
        rows="10"
        cols="30"
        autoResize
        v-model="profileDescription"
        :maxlength="UserFunctions.MAX_DESCRIPTION_LENGTH"
        placeholder="Profile Description"
      />
      <div class="absolute bottom-0 right-0 mb-2 mr-3 text-sm text-gray-500">
        {{ profileDescription.length }}/{{ UserFunctions.MAX_DESCRIPTION_LENGTH }}
      </div>
    </div>

    <div class="flex flex-row justify-end gap-4">
      <Button severity="secondary" label="Cancel" class="w-1/3" @click="cancelForm" />
      <Button severity="secondary" label="Reset" class="w-1/3" @click="resetForm" />
      <Button label="Save" class="w-1/3" @click="saveForm" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { injectToast } from '@/functions/inject'
import type { SavedUser } from '@/interfaces/user.interface'
import * as UserFunctions from '@/functions/user'
import { computed, ref } from 'vue'
import { useAppStore } from '@/stores/app'

const props = defineProps<{
  user: SavedUser
  close: () => void
}>()

const store = useAppStore()

const toast = injectToast()

const profilePicture = ref<string>(props.user.profilePicture)
const username = ref<string>(props.user.username)
const email = ref<string>(props.user.email)
const fullName = ref<string>(props.user.fullName)
const phoneNumber = ref<string>(props.user.phoneNumber)
const profileDescription = ref<string>(props.user.profileDescription)

const isPhoneValid = computed(() => UserFunctions.isPhoneValid(phoneNumber.value))
const isNameValid = computed(() => UserFunctions.isNameValid(fullName.value))
const isEmailValid = computed(() => UserFunctions.isEmailValid(email.value))

const resetFields = () => {
  profilePicture.value = props.user.profilePicture
  username.value = props.user.username
  email.value = props.user.email
  fullName.value = props.user.fullName
  phoneNumber.value = props.user.phoneNumber
  profileDescription.value = props.user.profileDescription
}

const cancelForm = () => {
  resetFields()
  props.close()
}

const resetForm = () => {
  resetFields()
}

const constructPayload = () => {
  const payload: Partial<SavedUser> = {}

  // take only the fields that have changed (note: username is not editable)
  if (profilePicture.value !== props.user.profilePicture)
    payload.profilePicture = profilePicture.value
  if (email.value !== props.user.email) payload.email = email.value
  if (fullName.value !== props.user.fullName) payload.fullName = fullName.value
  if (phoneNumber.value !== props.user.phoneNumber) payload.phoneNumber = phoneNumber.value
  if (profileDescription.value !== props.user.profileDescription)
    payload.profileDescription = profileDescription.value

  return payload
}

const validateForm = (): boolean => {
  if (!UserFunctions.isPhoneValid(phoneNumber.value)) {
    toast.add({
      severity: 'error',
      summary: 'Invalid Phone Number',
      detail: 'Please enter a valid phone number',
      life: 3000
    })
    return false
  }
  if (!UserFunctions.isNameValid(fullName.value)) {
    toast.add({
      severity: 'error',
      summary: 'Invalid Name',
      detail: 'Please enter your full name',
      life: 3000
    })
    return false
  }
  if (!UserFunctions.isEmailValid(email.value)) {
    toast.add({
      severity: 'error',
      summary: 'Invalid Email',
      detail: 'Please enter a valid email address',
      life: 3000
    })
    return false
  }
  return true
}

const saveForm = () => {
  if (!validateForm()) return

  const payload = constructPayload()

  if (Object.keys(payload).length === 0) {
    toast.add({
      severity: 'info',
      summary: 'No Changes',
      detail: 'No changes were made to the user profile',
      life: 3000
    })
    return
  }

  store.updateConnectedUser(payload).catch((error) => {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 3000
    })
    resetFields()
  })
  props.close()
}
</script>

<style scoped></style>
