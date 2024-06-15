<template>
  <div>
    <h1 class="text-3xl font-bold text-center text-surface-300 pt-8 select-none mb-10">
      Manage Listings
    </h1>
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

const userStore = useAppStore()
const userListingsIds = ref()
const userListings = ref()

const fetchListings = async () => {
  userListingsIds.value = (
    await API.getUsersByUserName([userStore.connectedUser!], ['listings'])
  )[0].listings
  userListings.value = await API.getListingsById(userListingsIds.value)
}

onBeforeMount(async () => {
  await userStore.performAsyncAction(fetchListings)
})
</script>

<style scoped></style>
