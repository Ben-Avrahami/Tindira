<template>
    <div>
        <h1 class="text-3xl font-bold text-center text-surface-300 pt-8 select-none mb-10">
            Manage Listings
        </h1>
        <UsersListingList :listings="userListings"></UsersListingList>
    </div>
</template>

<script setup lang="ts">

import { useAppStore } from '../stores/app'
import { ref } from 'vue'
import API from '@/api';
import UsersListingList from '@/components/UsersListingList.vue';

const userStore = useAppStore()
let userListingsIds = ref((await API.getUsersByUserName([userStore.connectedUser!], ["listings"]))[0].listings);
let userListings = ref((await API.getListingsById(userListingsIds.value)));

</script>

<style scoped></style>