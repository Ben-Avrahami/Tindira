<template>
  <div>
    <ViewTitle>Manage Listings</ViewTitle>
    <div>
      <UsersListings :listings="userStore.connectedUserListings" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import UsersListings from '@/components/manage_listings/UsersListings.vue'
import ViewTitle from '@/components/misc/ViewTitle.vue'

const userStore = useAppStore()
</script>

<style scoped></style>
