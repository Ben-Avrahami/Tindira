<template>
    <div>
        <div class="flex flex-col items-center justify-center">
            <div class="flex items-center justify-center">
                <Chip>Category:</Chip>
                <Dropdown @change="loadHistory()" v-model="selectedCategory" :options="userStore.categoryOptions"
                    placeholder="Choose a Category" />
            </div>
            <div class="flex items-center justify-center mb-4">
                <Chip>showLikes/Dislikes:</Chip>
                <Button class="text-2xl" text aria-label="Add" @click="showLikes = !showLikes, loadHistory()">
                    <template #icon>
                        <Icon v-if="showLikes" icon="mdi:like"></Icon>
                        <Icon v-if="!showLikes" icon="mdi:dislike"></Icon>
                    </template>
                </Button>
            </div>
        </div>
        <HistoryList :history="history" :isLike="showLikes" @refresh-history="loadHistory"></HistoryList>
        <Paginator template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            :rows="itemsPerPage" :totalRecords="totalItems"
            currentPageReportTemplate="{first} to {last} of {totalRecords}" @page="changePage">
        </Paginator>
    </div>
</template>

<script setup lang="ts">

import { useAppStore } from '../stores/app'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import API from '@/api';
import HistoryList from '@/components/HistoryList.vue';
import type { PageState } from 'primevue/paginator';

const userStore = useAppStore()

let selectedCategory = ref('')
let showLikes = ref(true)
let history = ref()
let itemsPerPage = ref(5)
let totalItems = ref(120)

async function loadHistory(page: number = 1) {
    if (typeof page !== 'number') {
        page = 1;
    }
    console.log("page is", page)
    const response = await API.getCategoryHistory(selectedCategory.value, userStore.connectedUser!, showLikes.value, page, itemsPerPage.value);
    history.value = response;
    // totalItems.value = response.total;
}
async function changePage(event: PageState) {
    await loadHistory(event.page + 1)
}


</script>

<style scoped></style>