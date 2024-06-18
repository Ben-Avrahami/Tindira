<template>
  <div>
    <!-- <div class="card" v-touch:swipe.left="swipeLeft" v-touch:swipe.right="swipeRight"> -->
    <TabMenu v-model:activeIndex="active" :model="items" />

    <div class="mx-4 mb-2">
      <Transition name="fade" mode="out-in">
        <ProfileView v-if="active === 0" key="0" />
        <ManageListingsView v-else-if="active === 1" key="1" />
        <SwipingHistoryView v-else-if="active === 2" key="2" />
        <AboutView v-else key="3" />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AboutView from './profile/AboutView.vue'
import ProfileView from './profile/ManageProfileView.vue'
import ManageListingsView from './profile/ManageListingsView.vue'
import SwipingHistoryView from './profile/HistoryView.vue'

const active = ref(0)
const items = ref([
  { label: 'Profile' },
  { label: 'Listings' },
  { label: 'History' },
  { label: 'About' }
])

// function swipeLeft() {
//   if (active.value < items.value.length - 1) active.value++
// }

// function swipeRight() {
//   if (active.value > 0) active.value--
// }
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
