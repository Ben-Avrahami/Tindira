<template>
  <div class="flex flex-col gap-4">
    <ViewTitle>Swiping History</ViewTitle>
    <Toolbar>
      <template #start>
        <div class="flex items-center justify-center w-full h-full text-center">
          <label class="mr-2">Category:</label>
          <Button
            v-for="(option, index) in ListingInterface.categories"
            :key="index"
            :severity="selectedCategory === option ? 'success' : 'secondary'"
            :label="option"
            @click="() => alternameCategory(option)"
          />
        </div>
      </template>

      <template #center>
        <IconField iconPosition="left" class="hidden md:block">
          <InputIcon>
            <Icon icon="mdi:search" />
          </InputIcon>
          <InputText placeholder="Search" disabled />
        </IconField>
      </template>

      <template #end>
        <div class="flex items-center justify-center w-full h-full text-center">
          <label class="mr-2">Show:</label>
          <Button severity="secondary" @click="alternateLikesDislikes">
            <template #icon>
              <Icon v-if="showLikes" icon="mdi:thumb-up" class="text-green-500" />
              <Icon v-else icon="mdi:thumb-down" class="text-red-500" />
            </template>
          </Button>
        </div>
      </template>
    </Toolbar>

    <HistoryList
      v-if="!userStore.isLoading"
      :history="history"
      :isLike="showLikes"
      :refreshHistory="loadHistory"
    />
    <Paginator
      v-if="history.length"
      template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      :rows="ITEMS_PER_PAGE"
      :totalRecords="totalItems"
      currentPageReportTemplate="{first} to {last} of {totalRecords}"
      @page="changePage"
    />
  </div>
</template>

<script setup lang="ts">
import * as ListingInterface from '@/interfaces/listing.interface'
import { useAppStore } from '@/stores/app'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import API from '@/api'
import type { PageState } from 'primevue/paginator'

import HistoryList from '@/components/history/HistoryList.vue'
import ViewTitle from '@/components/misc/ViewTitle.vue'

const userStore = useAppStore()

const selectedCategory = ref<string>(ListingInterface.CATEGORIES[0])
const showLikes = ref<boolean>(true)
const history = ref<ListingInterface.Listing[]>([])
const totalItems = ref<number>(0)

const ITEMS_PER_PAGE = 5

const alternateLikesDislikes = () => {
  showLikes.value = !showLikes.value
  history.value = []
  loadHistory()
}

const alternameCategory = (category: string) => {
  selectedCategory.value = category
  history.value = []
  loadHistory()
}

const loadHistory = async (page: number = 1) => {
  userStore.performAsyncAction(async () => {
    if (typeof page !== 'number') {
      page = 1
    }
    const response = await API.getCategoryHistory(
      selectedCategory.value,
      userStore.connectedUser!,
      showLikes.value,
      page,
      ITEMS_PER_PAGE
    )
    history.value = response.history.filter((item: any) => typeof item === 'object')
    totalItems.value = response.total
  })
}

const changePage = async (event: PageState) => {
  await loadHistory(event.page + 1)
}

loadHistory()
</script>

<style scoped></style>
