<template>

    <carousel :items-to-show="1" wrapAround>
        <slide v-for="slide in images" :key="slide">
            <Image alt="Apartment images" :src="slide" :preview="!isBigScreen"
                :style="isBigScreen ? '' : 'max-height: 30vh;'" />
        </slide>
        <template #addons>
            <navigation />
            <pagination />
        </template>
    </carousel>

</template>
<script setup lang="ts">

import { computed, ref, type PropType} from 'vue';
import { useAppStore } from '../stores/app'
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

const props = defineProps({
    images: Object as PropType<string[]>,
})

const userStore = useAppStore()

const isBigScreen = computed(() => window.innerWidth > 768)
</script>