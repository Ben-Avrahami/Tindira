<template>
  <div>
    <div class="flex flex-col items-center justify-center">
      <div class="flex items-center justify-center">
        <Chip>Category:</Chip>
        <Dropdown
          @change="loadHistory()"
          v-model="selectedCategory"
          :options="ListingInterface.categories"
          placeholder="Choose a Category"
        />
      </div>
      <div class="flex items-center justify-center mb-4">
        <Chip>showLikes/Dislikes:</Chip>
        <Button class="text-2xl" text aria-label="Add" @click="alternateLikesDislikes">
          <template #icon>
            <Icon v-if="showLikes" icon="mdi:like" color="green" />
            <Icon v-else icon="mdi:dislike" />
          </template>
        </Button>
      </div>
    </div>
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
import HistoryList from '@/components/history/HistoryList.vue'
import type { PageState } from 'primevue/paginator'

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
