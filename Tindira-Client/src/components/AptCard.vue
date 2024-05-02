<template>
  <VueDraggable ref="el" v-model="dummyArrForSwiping" :disabled="disableDrag" @end="onEnd" @start="onStart"
    handle=".drag-area">
    <transition name="swipe">
      <Card class="w-4/5 mx-auto swipe-card" ref="card">
        <template #header>
          <div>
            <AptImageCarousel />
          </div>
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
            <Button severity="secondary" text rounded aria-label="Info" class="mr-2 text-3xl" @click="showFullAptData">
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
          <div class="mx-auto space-x-24 flex justify-center">
            <Button severity="secondary" rounded aria-label="Like" @click="swipe(false)">
              <template #icon>
                <Icon icon="mdi:times"></Icon>
              </template>
            </Button>

            <Button class="text-rose-700" rounded aria-label="Like" @click="swipe(true)">
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
import { computed, defineAsyncComponent, getCurrentInstance, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { VueDraggable, type SortableEvent } from 'vue-draggable-plus'

import { useAppStore } from '../stores/app'

const userStore = useAppStore()

const dummyArrForSwiping = ref([])
let disableDrag = ref(false)

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
    swipe(true);
  } else if (clientX < startingX - sensitivity) {
    console.log('left');
    swipe(false);
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
    disableDrag.value = false;
  })
})

async function swipe(isLike: boolean) {
  const el = document.querySelector('.swipe-card')
  if (el) {
    disableDrag.value = true;
    isLike ? el.classList.add('animate-right') : el.classList.add('animate-left')
  }
}

import { useDialog } from 'primevue/usedialog'
import AptImageCarousel from './AptImageCarousel.vue';

const dialog = useDialog()
const ApartmentDialog = defineAsyncComponent(() => import('@/components/AptDialog.vue'))


const showFullAptData = () => {
  dialog.open(ApartmentDialog, {
    props: {
      header: userStore.nextListingsArr[0]?.title,
      style: {
        width: '95vw'
      },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      modal: true,
      closable: true,
    },
    onClose: (isLike) => {
      if (isLike?.data !== undefined) {
        setTimeout(() => {
          swipe(isLike.data);
        }, 500);
      }
    }
  })
}

</script>

<style scoped>
.animate-right {
  animation: swipeRight 0.8s;
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
