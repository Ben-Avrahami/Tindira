<template>
  <div class="flex flex-col text-center justify-center gap-5">
    <Avatar :image="profilePicture" size="xlarge" shape="circle" class="mx-auto mt-10 mb-10" />
    <InputGroup>
      <InputText id="username" v-model="username" placeholder="Username" disabled />
      <InputGroupAddon>
        <label for="username">
          <Icon icon="mdi:account" />
        </label>
      </InputGroupAddon>
    </InputGroup>
    <InputGroup>
      <InputText id="email" v-model="email" placeholder="Email" :disabled="!editing" />
      <InputGroupAddon>
        <label for="email">
          <Icon icon="mdi:email" />
        </label>
      </InputGroupAddon>
    </InputGroup>
    <InputGroup>
      <InputText id="fullName" v-model="fullName" placeholder="Full Name" :disabled="!editing" />
      <InputGroupAddon>
        <label for="fullName">
          <Icon icon="mdi:card-account-details" />
        </label>
      </InputGroupAddon>
    </InputGroup>
    <InputGroup>
      <InputText
        id="phoneNumber"
        v-model="phoneNumber"
        placeholder="Phone Number"
        :disabled="!editing"
      />
      <InputGroupAddon>
        <label for="phoneNumber">
          <Icon icon="mdi:phone" />
        </label>
      </InputGroupAddon>
    </InputGroup>
    <Textarea
      rows="10"
      cols="30"
      autoResize
      v-model="profileDescription"
      placeholder="Profile Description"
      :disabled="!editing"
    />

    <div v-if="editable" class="flex flex-col">
      <div v-if="editing" class="flex justify-end gap-4">
        <Button severity="secondary" label="Cancel" class="w-1/3" @click="cancelForm" />
        <Button severity="secondary" label="Reset" class="w-1/3" @click="resetForm" />
        <Button label="Save" class="w-1/3" @click="saveForm" />
      </div>
      <div v-else class="flex flex-col justify-center">
        <Button severity="secondary" label="Edit Profile" @click="editing = true" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { injectToast } from '@/functions/inject'
import type { SavedUser } from '@/stores/State.interface'
import { ref } from 'vue'

const props = defineProps<{
  user: SavedUser
  editable: boolean
}>()

const toast = injectToast()

const editing = ref<boolean>(false)

const profilePicture = ref<string>(props.user.profilePicture)
const username = ref<string>(props.user.username)
const email = ref<string>(props.user.email)
const fullName = ref<string>(props.user.fullName)
const phoneNumber = ref<string>(props.user.phoneNumber)
const profileDescription = ref<string>(props.user.profileDescription)

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
  editing.value = false
}

const resetForm = () => {
  resetFields()
}

const saveForm = () => {
  toast.add({
    severity: 'info',
    summary: 'Save',
    detail: 'Save not implemented yet',
    life: 3000
  })
  editing.value = false
}
</script>

<style scoped></style>
