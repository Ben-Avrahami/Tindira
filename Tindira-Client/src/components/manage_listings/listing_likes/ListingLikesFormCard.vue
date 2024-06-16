<template>
  <div class="flex flex-col sm:flex-row sm:items-center p-4 gap-3 bg-red-300 dark:bg-red-900">
    <div class="md:w-[10rem] relative">
      <Image class="block xl:block mx-auto rounded-md w-full" :src="user.profilePicture" />
    </div>
    <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-4">
      <div class="flex flex-row md:flex-col justify-between items-start gap-2">
        <div>
          <span class="font-medium text-secondary text-sm">{{ user.fullName }}</span>
          <div class="text-lg font-medium text-surface-700 dark:text-surface-0/80 mt-2">
            {{ user.profileDescription }}
          </div>
        </div>
      </div>
      <div class="flex flex-row-reverse md:flex-row gap-2">
        <Button
          severity="secondary"
          text
          rounded
          aria-label="Info"
          class="mr-2 text-3xl"
          @click="openWhatsAppChat(user)"
        >
          <template #icon>
            <Icon icon="ic:round-whatsapp"></Icon>
          </template>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useAppStore } from '../../../stores/app'
import type { SavedUser } from '@/stores/State.interface'

const userStore = useAppStore()

defineProps<{
  user: SavedUser
}>()

const openWhatsAppChat = (user: SavedUser) => {
  const whatsAppCompatiblePhoneNumber = convertPhoneNumber(user.phoneNumber)
  const url = `https://wa.me/${whatsAppCompatiblePhoneNumber}?text=Hey, im ${userStore.connectedUserObject?.fullName} and i saw you liked my listing on Tindira. i would like to know more about it.`
  window.open(url, '_blank')
}

const convertPhoneNumber = (phoneNumber: string) => {
  let numberWithoutDash = phoneNumber.replace(/-/g, '')
  let convertedNumber = '972' + numberWithoutDash.substring(1)
  return convertedNumber
}
</script>
