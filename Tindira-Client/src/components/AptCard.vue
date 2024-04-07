<template>
    <VueDraggable ref="el" v-model="links" @end="onEnd">
        <Card>
            <template #header>
                <Carousel :value="links" :numVisible="1" :numScroll="1" circular>
                    <template #item="slotProps">
                        <div class="border-1 surface-border border-round m-2  p-3">
                            <div class="relative mx-auto">
                                <Image alt="Apartment images" class="w-full border-round" :src="slotProps.data"
                                    preview />
                            </div>
                        </div>
                    </template>
                </Carousel>
            </template>
            <template #title>Lior's Home</template>
            <template #subtitle>
                <div class="flex justify-between items-center">
                    Sublet- Tel Aviv
                    <Button severity="secondary" text rounded aria-label="Info" class="mr-2" style="font-size: 2rem;">
                        <template #icon>
                            <Icon icon="ooui:info-filled"></Icon>
                        </template>
                    </Button>
                </div>
            </template>
            <template #content>
                <p class="m-0">
                    A nice cosy home, in the most vibrant place in tel aviv
                </p>

            </template>
            <template #footer>
                <div class="mx-auto space-x-24 flex justify-center">

                    <Button severity="secondary" rounded aria-label="Like">
                        <template #icon>
                            <Icon icon="mdi:times"></Icon>
                        </template>
                    </Button>

                    <Button class="text-rose-700" rounded aria-label="Like">
                        <template #icon>
                            <Icon icon="ph:heart"></Icon>
                        </template>
                    </Button>

                </div>
            </template>
        </Card>
    </VueDraggable>
</template>

<script setup lang="ts">

import { ref } from "vue";
import { Icon } from '@iconify/vue';
import Card from 'primevue/card';
import Carousel from 'primevue/carousel';
import Button from 'primevue/Button';
import Image from 'primevue/image';
import { VueDraggable } from 'vue-draggable-plus'

const links = ref([
    'https://foyr.com/learn/wp-content/uploads/2022/05/guest-room-in-a-house-1024x752.jpg',
    'https://chesmar.com/wp-content/uploads/2019/05/how-many-bedrooms-should-my-new-home-have.jpg',
    'https://foyr.com/learn/wp-content/uploads/2022/05/guest-room-in-a-house-1024x752.jpg',
    'https://www.thespruce.com/thmb/2_Q52GK3rayV1wnqm6vyBvgI3Ew=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/put-together-a-perfect-guest-room-1976987-hero-223e3e8f697e4b13b62ad4fe898d492d.jpg'
])

function onEnd(event: any, offsetX: any, offsetY: any) {
    console.log(event);
    if (event.originalEvent.changedTouches[0].clientX > 0) {
        console.log("right");
    }
    else {
        console.log("left")
    }
}


</script>