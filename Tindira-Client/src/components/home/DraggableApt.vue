<template>
  <VueDraggable
    v-model="dummyArrForSwiping"
    :disabled="disableDrag"
    @end="onEnd"
    @start="onStart"
    handle=".drag-area"
  >
    <div v-if="userStore.nextListingsArr.length > 0" ref="swipeCard">
      <DraggableAptCard :listing="userStore.nextListingsArr[0]" :swipe />
    </div>
    <div v-else>
      <p class="text-center text-2xl">You swiped all the apartments! Time to take a break</p>
    </div>
  </VueDraggable>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import DraggableAptCard from './DraggableAptCard.vue'

import { useAppStore } from '@/stores/app'
import API from '@/api'

const userStore = useAppStore()

const dummyArrForSwiping = ref([])
const disableDrag = ref(false)
const rerenderer = ref(0)

let startingX = 0
const sensitivity = 80

const swipeCard = ref<HTMLElement | null>(null)

function onEnd(event: any) {
  const originalEvent = event.originalEvent
  const isTouchEvent = originalEvent instanceof TouchEvent

  const clientX = isTouchEvent ? originalEvent.changedTouches[0].clientX : originalEvent.clientX
  if (clientX > startingX + sensitivity) {
    swipe(true)
  } else if (clientX < startingX - sensitivity) {
    swipe(false)
  }
}

const onStart = (event: any) => {
  if (event.originalEvent instanceof TouchEvent) {
    startingX = event.originalEvent.changedTouches[0].clientX
  } else if (event.originalEvent instanceof MouseEvent) {
    startingX = event.originalEvent.clientX
  }
}

onMounted(() => {
  if (swipeCard.value) {
    swipeCard.value.addEventListener('animationend', async () => {
      rerenderer.value++
      userStore.nextListingsArr.shift()
      await userStore.getAndPushNextListing(1)
      swipeCard.value?.classList.remove('animate-right')
      swipeCard.value?.classList.remove('animate-left')
      disableDrag.value = false
    })
  }
})

async function swipe(isLike: boolean) {
  if (swipeCard.value) {
    disableDrag.value = true
    isLike
      ? swipeCard.value.classList.add('animate-right')
      : swipeCard.value.classList.add('animate-left')
  }
  API.tagListing(userStore.nextListingsArr[0]?.listingId, userStore.connectedUser!, isLike)
}
</script>

<style scoped>
.animate-right {
  animation: swipeRight 0.8s ease-out;
}

@keyframes swipeRight {
  0% {
    transform: translateX(0);
    opacity: 1;
  }

  100% {
    transform: translateX(100%) translateY(-20%) rotate(20deg);
    opacity: 0;
  }
}

.animate-left {
  animation: swipeLeft 0.8s ease-out;
}

@keyframes swipeLeft {
  0% {
    transform: translateX(0);
    opacity: 1;
  }

  100% {
    transform: translateX(-100%) translateY(-20%) rotate(-20deg);
    opacity: 0;
  }
}
</style>
