<template>
  <div class="flex flex-col items-center justify-center h-full">
    <h1 class="text-3xl font-bold text-center text-surface-300 pt-8 select-none">
      Welcome to Tindira
    </h1>
    <div class="flex flex-col items-center justify-center h-full">
      <LoginButtons
        v-if="method === LoginMethod.UNDEFINED"
        :loginWithGoogle="() => (method = LoginMethod.GOOGLE)"
        :loginWithPhoneNumber="() => (method = LoginMethod.PHONE_NUMBER)"
        :loginWithUsername="() => (method = LoginMethod.USERNAME)"
      />
      <KeepAlive v-else>
        <component :is="methods[method]" :attemptLogin :back />
      </KeepAlive>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { ToastServiceMethods } from 'primevue/toastservice'

import LoginButtons from '@/components/login/LoginButtons.vue'
import WithGoogle from '@/components/login/WithGoogle.vue'
import WithPhone from '@/components/login/WithPhone.vue'
import WithUsername from '@/components/login/WithUsername.vue'

import API from '@/api'

const router = useRouter()

const toastService = inject<ToastServiceMethods>('toast')
if (!toastService) {
  console.warn('Toast service not found')
}
const toast = toastService!

const defaultErrorMessage = 'An error occurred while logging in. Please try again later.'

enum LoginMethod {
  UNDEFINED = 'undefined',
  GOOGLE = 'WithGoogle',
  PHONE_NUMBER = 'WithPhone',
  USERNAME = 'WithUsername'
}

const method = ref<LoginMethod>(LoginMethod.UNDEFINED)

const methods = {
  WithGoogle,
  WithPhone,
  WithUsername
}

const printError = (message: string = defaultErrorMessage) => {
  toast.add({
    severity: 'error',
    summary: 'Login Error',
    detail: message,
    life: 3000
  })
}

const login = () => {
  router.push('/')
}

const attemptLogin = async (username: string, password: string) => {
  try {
    const response = await API.loginUser(username, password)
    if (response.status === 200) {
      toast.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'You have successfully logged in',
        life: 3000
      })
      login()
    } else {
      printError()
    }
  } catch (error: any) {
    printError(error.response.data.message)
  }
}

const back = () => {
  method.value = LoginMethod.UNDEFINED
}

// const loginWithGoogle = () => {
//   attemptLogin('Yehonatan', '123ASDasd')
// }
</script>

<style scoped></style>
