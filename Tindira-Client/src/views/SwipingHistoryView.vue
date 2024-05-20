<template>
    <div class="flex flex-col items-center justify-center">
        <div class="flex items-center justify-center">
            <Chip>Category:</Chip>
            <Dropdown @change="loadHistory" v-model="selectedCategory" :options="userStore.categoryOptions"
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

</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/app'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import API from '@/api';
import HistoryList from '@/components/HistoryList.vue';

const userStore = useAppStore()

let selectedCategory = ref('')
let showLikes = ref(true)
let history = ref()

async function loadHistory() {
    history.value = await API.getCategoryHistory(selectedCategory.value, userStore.connectedUser!, showLikes.value, 1, 10);
}

let userDescription = ref('this is the users decription')
</script>

<style scoped></style>