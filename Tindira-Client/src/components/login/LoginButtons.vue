<template>
  <Button :class="buttonClasses" @click="loginWithGoogle" disabled>
    <Icon icon="mdi:google" :class="iconsClasses" />
    Continue with Google
  </Button>

  <Button :class="buttonClasses" @click="loginWithPhoneNumber" disabled>
    <Icon icon="mdi:phone" :class="iconsClasses" />
    Continue with Phone Number
  </Button>

  <Button :class="buttonClasses" @click="loginWithUsername">
    <Icon icon="mdi:user" :class="iconsClasses" />
    Continue with Username
  </Button>

  <RouterLink class="w-full" to="/signup">
    <Button severity="success" :class="buttonClasses">
      <Icon icon="mdi:account-plus" :class="iconsClasses" />
      Sign up!
    </Button>
  </RouterLink>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

const buttonClasses = 'my-1.5 w-full px-12'
const iconsClasses = 'absolute left-3'

defineProps<{
  loginWithGoogle: () => void
  loginWithPhoneNumber: () => void
  loginWithUsername: () => void
}>()
</script>

<style scoped></style>
