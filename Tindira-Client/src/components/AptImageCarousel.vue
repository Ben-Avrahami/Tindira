<template>

    <carousel ref="myCarousel" :items-to-show="1" wrapAround :modelValue="activeImage">
        <slide v-for="slide in userStore.nextListingsArr[0]?.images" :key="slide">
            <Image alt="Apartment images" :src="slide" :preview="!isBigScreen"
                :style="isBigScreen ? '' : 'max-height: 20vh;'" />
        </slide>
        <template #addons>
            <navigation />
            <pagination />
        </template>
    </carousel>

</template>
<script setup lang="ts">

import { computed, ref, watch } from 'vue';
import { useAppStore } from '../stores/app'
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import { storeToRefs } from 'pinia';


const userStore = useAppStore()

const isBigScreen = computed(() => window.innerWidth > 768)

let activeImage = ref(0);
const myCarousel = ref(null) as any;
function reset() {
    myCarousel.slideTo(0);
}
</script>