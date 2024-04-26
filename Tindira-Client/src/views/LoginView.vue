<template>
  <div class="flex flex-col items-center justify-center h-full">
    <h1 class="text-3xl font-bold text-center text-surface-300 pt-8">Welcome to Tindira</h1>
    <div class="flex flex-col items-center justify-center h-full">
      <Button class="my-2 w-full" @click="loginWithGoogle">
        <Icon icon="mdi:google" class="mr-2" />
        Continue with Google
      </Button>
      <Button class="my-2 w-full" @click="loginWithPhoneNumber">
        <Icon icon="mdi:phone" class="mr-2" />
        Continue with Phone Number
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const router = useRouter()

const login = () => {
  router.push('/')
}
const loginWithGoogle = () => {
  login()
}
const loginWithPhoneNumber = () => {
  login()
}
</script>

<style scoped></style>
