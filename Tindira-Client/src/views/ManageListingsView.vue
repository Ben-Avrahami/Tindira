<template>
  <div>
    <ViewTitle>Manage Listings</ViewTitle>
    <div>
      <UsersListings :listings="userListings" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { onBeforeMount, ref } from 'vue'
import API from '@/api'
import UsersListings from '@/components/manage_listings/UsersListings.vue'
import type { Listing } from '@/interfaces/listing.interface'
import ViewTitle from '@/components/misc/ViewTitle.vue'

const userStore = useAppStore()
const userListings = ref<Listing[]>()

onBeforeMount(async () => {
  await userStore.performAsyncAction(async () => {
    const listings = (await API.getUsersByUserName([userStore.connectedUser!], ['listings']))[0]
      .listings
    userListings.value = await API.getListingsById(listings)
  })
})
</script>

<style scoped></style>
