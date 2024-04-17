<template>
  <VueDraggable ref="el" v-model="dummyArrForSwiping" @end="onEnd" @start="onStart" handle=".drag-area">
    <transition name="swipe">
      <Card class="w-4/5 mx-auto swipe-card" ref="card">
        <template #header>

          <Galleria v-if="isBigScreen" :value="currentListing?.images" :numVisible="3" :circular="true"
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

          <Carousel v-else :value="currentListing?.images" :numVisible="1" :numScroll="1" circular>
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
          <div class="drag-area">{{ currentListing?.title ?? 'You swiped all the apartments! Time to take a break' }}
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
          <p class="drag-area m-0">{{ currentListing?.description }}</p>
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

import { computed, ref } from "vue";
import { Icon } from '@iconify/vue';
import Card from 'primevue/card';
import Carousel from 'primevue/carousel';
import Galleria from 'primevue/galleria';
import Button from 'primevue/Button';
import Image from 'primevue/image';
import { VueDraggable } from 'vue-draggable-plus'
import API from "@/api";
import type { Listing } from "@/interfaces/listing.interface";

let currentListing = ref<Listing>()
let nextListingsArr = ref<Listing[]>(await API.getNextListings(5, "rent", {}, "galben"))
await setNextListing();
console.log(currentListing.value)

const isBigScreen = computed(() => window.innerWidth > 768);

const dummyArrForSwiping = ref([])

let startingX = 0
let sensitivity = 50

function onEnd(event: any) {
  console.log(event)
  if (event.originalEvent instanceof TouchEvent) {
    if (event.originalEvent.changedTouches[0].clientX > startingX + sensitivity) {
      console.log('right')
      swipe(true)
    }
    if (event.originalEvent.changedTouches[0].clientX < startingX - sensitivity) {
      console.log('left')
      swipe(false)
    }
  } else if (event.originalEvent instanceof MouseEvent) {
    if (event.originalEvent.clientX > startingX + sensitivity) {
      console.log('right')
      swipe(true)
    }
    if (event.originalEvent.clientX < startingX - sensitivity) {
      console.log('left')
      swipe(false)
    }
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

async function swipe(isLike: boolean) {
  const el = document.querySelector('.swipe-card')
  el!.addEventListener('animationend', async () => {
    nextListingsArr.value.shift();
    await setNextListing()
    el!.classList.remove('animate-right')
    el!.classList.remove('animate-left')
  })
  if (el) {
    isLike ? el.classList.add('animate-right') : el.classList.add('animate-left')
  }
}

async function setNextListing() {
  currentListing.value = nextListingsArr.value[0]
  console.log("currentListing", currentListing.value)
  const nextListing = await API.getNextListings(1, "rent", {}, "galben");
  nextListingsArr.value.push(...nextListing);
  console.log("nextArr", nextListingsArr.value)
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
