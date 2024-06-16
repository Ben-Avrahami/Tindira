<template>
  <DataView v-if="finishedLoading" :value="usersList" dataKey="username">
    <template #list="slotProps">
      <div class="grid grid-nogutter gap-5">
        <div v-for="(item, index) in slotProps.items" :key="index">
          <ListingLikesFormCard :user="item" />
        </div>
      </div>
    </template>
    <template #empty>
      <div class="flex text-center justify-center text-2xl">No Users Liked Your Listing Yet</div>
    </template>
  </DataView>
  <div class="flex justify-center items-center" v-else>
    <p>Loading...</p>
  </div>

  <Paginator
    template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
    :rows="ITEMS_PER_PAGE"
    :totalRecords="totalItems"
    currentPageReportTemplate="{first} to {last} of {totalRecords}"
    @page="changePage"
  >
  </Paginator>
</template>

<script setup lang="ts">
import { watchEffect, ref } from 'vue'
import type { PageState } from 'primevue/paginator'
import type { SavedUser } from '@/stores/State.interface'
import API from '@/api'

import ListingLikesFormCard from './ListingLikesFormCard.vue'

const ITEMS_PER_PAGE = 5

const totalItems = ref<number>(0)
const usersList = ref<SavedUser[]>()
const finishedLoading = ref(false)

const props = defineProps<{
  listingId: string
}>()

watchEffect(async () => {
  await loadUsers()
})

async function changePage(event: PageState) {
  await loadUsers(event.page + 1)
}

async function loadUsers(page: number = 1) {
  finishedLoading.value = false
  if (typeof page !== 'number') {
    page = 1
  }
  const usersListObject = await API.getListingLikedBy(props.listingId, page, ITEMS_PER_PAGE)
  usersList.value = usersListObject.users.filter((item: any) => typeof item === 'object')
  totalItems.value = usersListObject.totalItems
  finishedLoading.value = true
}
</script>
