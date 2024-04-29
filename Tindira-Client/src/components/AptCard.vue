<template>
  <VueDraggable ref="el" v-model="dummyArrForSwiping" @end="onEnd" @start="onStart" handle=".drag-area">
    <transition name="swipe">
      <Card class="w-4/5 mx-auto swipe-card" ref="card">
        <template #header>
          <Galleria v-if="isBigScreen" :value="userStore.nextListingsArr[0]?.images" :numVisible="3" :circular="true"
            :showThumbnails="false" :showIndicators="true" :showItemNavigators="true" :changeItemOnIndicatorHover="true"
            :fullscreen="true">
            <template #item="slotProps">
              <div class="relative mx-auto">
                <Image alt="Apartment images" width="700" class="w-full border-round" :src="slotProps.item" />
              </div>
            </template>
            <template #thumbnail="slotProps">
              <img :src="slotProps.item" alt="Apartment images" style="display: block" />
            </template>
          </Galleria>

          <Carousel v-else :value="userStore.nextListingsArr[0]?.images" :numVisible="1" :numScroll="1" circular>
            <template #item="slotProps">
              <div class="border-1 surface-border border-round m-2 p-3">
                <div class="relative mx-auto">
                  <Image alt="Apartment images" width="400" class="w-full border-round" :src="slotProps.data" preview />
                </div>
              </div>
            </template>
          </Carousel>
        </template>

        <template #title>
          <div class="drag-area">
            {{
              userStore.nextListingsArr[0]?.title ??
              'You swiped all the apartments! Time to take a break'
            }}
          </div>
        </template>
        <template #subtitle>
          <div class="drag-area flex justify-between items-center">
            Full information
            <Button severity="secondary" text rounded aria-label="Info" class="mr-2 text-3xl">
              <template #icon>
                <Icon icon="ooui:info-filled"></Icon>
              </template>
            </Button>
          </div>
        </template>
        <template #content>
          <p class="drag-area m-0">{{ userStore.nextListingsArr[0]?.description }}</p>
        </template>
        <template #footer>
          <div class="drag-area mx-auto space-x-24 flex justify-center drag-area">
            <Button severity="secondary" rounded aria-label="Like" @click="swipe(false)">
              <template #icon>
                <Icon icon="mdi:times"></Icon>
              </template>
            </Button>

            <Button class="text-rose-700 drag-area" rounded aria-label="Like" @click="swipe(true)">
              <template #icon>
                <Icon icon="ph:heart"></Icon>
              </template>
            </Button>
          </div>
        </template>
      </Card>
    </transition>
  </VueDraggable>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { VueDraggable, type SortableEvent } from 'vue-draggable-plus'

import { useAppStore } from '../stores/app'

const userStore = useAppStore()

const isBigScreen = computed(() => window.innerWidth > 768)

const dummyArrForSwiping = ref([])

let startingX = 0
let sensitivity = 80

function onEnd(event: any) {
  console.log(event);

  const originalEvent = event.originalEvent;
  const isTouchEvent = originalEvent instanceof TouchEvent;

  const clientX = isTouchEvent ? originalEvent.changedTouches[0].clientX : originalEvent.clientX;
  const clientY = isTouchEvent ? originalEvent.changedTouches[0].clientY : originalEvent.clientY;

  if (clientX > startingX + sensitivity) {
    console.log('right');
    swipe(true, clientX, clientY);
  } else if (clientX < startingX - sensitivity) {
    console.log('left');
    swipe(false, clientX, clientY);
  }
}

function onStart(event: any) {
  if (event.originalEvent instanceof TouchEvent) {
    startingX = event.originalEvent.changedTouches[0].clientX
  } else if (event.originalEvent instanceof MouseEvent) {
    startingX = event.originalEvent.clientX
  }
  console.log('starting x is ', startingX)
}

onMounted(() => {
  const el = document.querySelector('.swipe-card')
  el!.addEventListener('animationend', async () => {
    userStore.nextListingsArr.shift()
    await userStore.getNextListing(1)
    el!.classList.remove('animate-right')
    el!.classList.remove('animate-left')
  })
})

async function swipe(isLike: boolean) {
  const el = document.querySelector('.swipe-card')
  if (el) {
    isLike ? el.classList.add('animate-right') : el.classList.add('animate-left')
  }
}
</script>

<style scoped>
.animate-right {
  animation: swipeRight 1s;
}

@keyframes swipeRight {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(100%) translateY(-20%) rotate(20deg);
  }
}

.animate-left {
  animation: swipeLeft 1s ease-out;
}

@keyframes swipeLeft {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-100%) translateY(-20%) rotate(-20deg);
  }
}
</style>
