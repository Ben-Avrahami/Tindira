<template>
  <VueDraggable ref="el" v-model="links" @end="onEnd" @start="onStart" handle=".drag-area">
    <transition name="swipe">
      <Card class="w-4/5 mx-auto swipe-card" ref="card">
        <template #header>

          <Galleria v-if="isBigScreen" :value="links" :numVisible="3" :circular="true" :showThumbnails="false"
            :showIndicators="true" :showItemNavigators="true" :changeItemOnIndicatorHover="true" :fullscreen="true">
            <template #item="slotProps">

              <div class="relative mx-auto">
                <Image alt="Apartment images" class="w-full border-round" :src="slotProps.item.src" />
              </div>

            </template>
            <template #thumbnail="slotProps">
              <img :src="slotProps.item.src" alt="Apartment images" style="display: block" />
            </template>
          </Galleria>

          <Carousel v-else :value="links" :numVisible="1" :numScroll="1" circular>
            <template #item="slotProps">
              <div class="border-1 surface-border border-round m-2 p-3">
                <div class="relative mx-auto">
                  <Image alt="Apartment images" class="w-full border-round" :src="slotProps.data.src" preview />
                </div>
              </div>
            </template>
          </Carousel>
        </template>

        <template #title>
          <div class="drag-area">Lior's Home</div>
        </template>
        <template #subtitle>
          <div class="drag-area flex justify-between items-center">
            Sublet- Tel Aviv
            <Button severity="secondary" text rounded aria-label="Info" class="mr-2 text-3xl">
              <template #icon>
                <Icon icon="ooui:info-filled"></Icon>
              </template>
            </Button>
          </div>
        </template>
        <template #content>
          <p class="drag-area m-0">A nice cosy home, in the most vibrant place in tel aviv</p>
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

const links = ref([
  {
    src: 'https://foyr.com/learn/wp-content/uploads/2022/05/guest-room-in-a-house-1024x752.jpg',
    alt: 'Apartment Image 1'
  },
  {
    src: 'https://chesmar.com/wp-content/uploads/2019/05/how-many-bedrooms-should-my-new-home-have.jpg',
    alt: 'Apartment Image 2'
  },
  {
    src: 'https://foyr.com/learn/wp-content/uploads/2022/05/guest-room-in-a-house-1024x752.jpg',
    alt: 'Apartment Image 3'
  },
  {
    src: 'https://www.thespruce.com/thmb/2_Q52GK3rayV1wnqm6vyBvgI3Ew=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/put-together-a-perfect-guest-room-1976987-hero-223e3e8f697e4b13b62ad4fe898d492d.jpg',
    alt: 'Apartment Image 4'
  }
])

const isBigScreen = computed(() => window.innerWidth > 768);

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
  console.log(await API.checkHealth());
  const el = document.querySelector('.swipe-card')
  el!.addEventListener('animationend', () => {
    el!.classList.remove('animate-right')
    el!.classList.remove('animate-left')
  })
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
