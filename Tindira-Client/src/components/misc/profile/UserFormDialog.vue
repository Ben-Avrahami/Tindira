<template>
  <div>
    <div v-if="!dialogRef">
      <p>Loading...</p>
    </div>
    <div v-else-if="!user">
      <p>Failed to fetch user details!</p>
    </div>
    <UserForm v-else :user :close />
  </div>
</template>

<script setup lang="ts">
import * as UserInterface from '@/interfaces/user.interface'
import { watchEffect, inject, ref, type Ref } from 'vue'
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'
import type { SavedUser } from '@/interfaces/user.interface'

import UserForm from './UserForm.vue'

const dialogRef = inject<Ref<DynamicDialogInstance>>('dialogRef')

const user = ref<SavedUser>()

watchEffect(() => {
  if (dialogRef && dialogRef.value) {
    const potentialUser = dialogRef?.value.data.user
    if (UserInterface.isUserInerface(potentialUser)) {
      user.value = potentialUser
    } else {
      console.error('Type check failed for user:', potentialUser)
    }
  }
})

const close = () => {
  dialogRef?.value.close()
}
</script>
