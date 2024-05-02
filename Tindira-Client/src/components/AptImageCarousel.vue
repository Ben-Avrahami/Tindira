<template>
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
                    <Image alt="Apartment images" width="400" class="w-full border-round" :src="slotProps.data" preview
                        style="max-height: 20vh;" />
                </div>
            </div>
        </template>
    </Carousel>
</template>
<script setup lang="ts">

import { computed } from 'vue';
import { useAppStore } from '../stores/app'

const userStore = useAppStore()

const isBigScreen = computed(() => window.innerWidth > 768)
</script>