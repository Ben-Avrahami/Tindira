<template>
    <div class="flex flex-col items-center justify-center">
        <div class="flex items-center justify-center">
            <Chip>Category:</Chip>
            <Dropdown @change="loadHistory" v-model="selectedCategory" :options="userStore.categoryOptions"
                placeholder="Choose a Category" />
        </div>
        <div class="flex items-center justify-center mb-4">
            <Chip>showLikes/Dislikes:</Chip>
            <Button class="text-2xl" text aria-label="Add" @click="showLikes = !showLikes">
                <template #icon>
                    <Icon v-if="showLikes" icon="mdi:like"></Icon>
                    <Icon v-if="!showLikes" icon="mdi:dislike"></Icon>
                </template>
            </Button>
        </div>
    </div>

    

</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/app'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import API from '@/api';

const userStore = useAppStore()

let selectedCategory = ref('')
let showLikes = ref(true)

function loadHistory() {
    console.log(selectedCategory)
    API.getCategoryHistory(selectedCategory.value, "galben", showLikes.value, 1, 10)
}

let userDescription = ref('this is the users decription')
</script>

<style scoped></style>