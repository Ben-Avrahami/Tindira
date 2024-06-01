<template>
  <div class="flex flex-col items-center justify-center h-full">
    <h1 class="text-3xl font-bold text-center text-surface-300 pt-8 select-none">
      Welcome to Tindira
    </h1>
    <img src="@/assets/logo.png" alt="Image" width="100" class="mt-10" />
    <div class="flex flex-col items-center justify-center h-full">
      <Transition name="fade" mode="out-in">
        <KeepAlive>
          <LoginButtons v-if="method === LoginMethod.UNDEFINED" :loginWithGoogle="() => (method = LoginMethod.GOOGLE)"
            :loginWithPhoneNumber="() => (method = LoginMethod.PHONE_NUMBER)"
            :loginWithUsername="() => (method = LoginMethod.USERNAME)" />
          <component v-else :is="methods[method]" :attemptLogin :back />
        </KeepAlive>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { injectToast } from '@/functions/inject'
import { useAppStore } from '@/stores/app'

import LoginButtons from '@/components/login/LoginButtons.vue'
import WithGoogle from '@/components/login/WithGoogle.vue'
import WithPhone from '@/components/login/WithPhone.vue'
import WithUsername from '@/components/login/WithUsername.vue'

import API from '@/api'

const router = useRouter()

const toast = injectToast()

const appStore = useAppStore()

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
      await appStore.connectUser(response.data.user.username)
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
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
