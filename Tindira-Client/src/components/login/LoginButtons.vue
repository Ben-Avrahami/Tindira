<template>
  <div class="flex flex-col">
    <Button :class="buttonClasses" @click="loginWithGoogle" disabled>
      <Icon icon="mdi:google" :class="iconsClasses" />
      Log in with Google
    </Button>

    <Button :class="buttonClasses" @click="loginWithPhoneNumber" disabled>
      <Icon icon="mdi:phone" :class="iconsClasses" />
      Log in with Phone Number
    </Button>

    <Button :class="buttonClasses" @click="loginWithUsername">
      <Icon icon="mdi:user" :class="iconsClasses" />
      Log in with Username
    </Button>

    <Divider layout="horizontal" align="center" nobg>
      <span class="mx-1">or</span>
    </Divider>

    <RouterLink class="w-full" to="/signup">
      <Button severity="success" :class="buttonClasses">
        <Icon icon="mdi:account-plus" :class="iconsClasses" />
        Sign up!
      </Button>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

const buttonClasses = 'my-1.5 w-full pl-10'
const iconsClasses = 'absolute left-3'

defineProps<{
  loginWithGoogle: () => void
  loginWithPhoneNumber: () => void
  loginWithUsername: () => void
}>()
</script>

<style scoped></style>
