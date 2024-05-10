<template>
    <DataView :value="products">
        <template #list="slotProps">
            <div class="grid grid-nogutter">
                <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                    <div class="flex flex-column sm:flex-row sm:align-items-center p-4 gap-3"
                        :class="{ 'border-top-1 surface-border': index !== 0 }">
                        <div class="md:w-10rem relative">
                            <img class="block xl:block mx-auto border-round w-full" :src="item.images[0]" />
                        </div>
                        <div
                            class="flex flex-column md:flex-row justify-content-between md:align-items-center flex-1 gap-4">
                            <div class="flex flex-row md:flex-column justify-content-between align-items-start gap-2">
                                <div>
                                    <!-- <span class="font-medium text-secondary text-sm">{{ item.title }}</span> -->
                                    <div class="text-lg font-medium text-900 mt-2">{{ item.title }}</div>
                                </div>
                                <div class="surface-100 p-1" style="border-radius: 30px">
                                    <!-- <div class="surface-0 flex align-items-center gap-2 justify-content-center py-1 px-2" style="border-radius: 30px; box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)">
                                    <span class="text-900 font-medium text-sm">{{ item.rating }}</span>
                                    <i class="pi pi-star-fill text-yellow-500"></i>
                                </div> -->
                                    <div class="text-lg font-medium text-900 mt-2">{{ item.description }}</div>
                                </div>
                            </div>
                            <div class="flex flex-column md:align-items-end gap-5">
                                <span class="text-xl font-semibold text-900">${{ item.price }}</span>
                                <div class="flex flex-row-reverse md:flex-row gap-2">
                                    <Button severity="secondary" text rounded aria-label="Info" class="mr-2 text-3xl"
                                        @click="showFullAptData">
                                        <template #icon>
                                            <Icon icon="ooui:info-filled"></Icon>
                                        </template>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </DataView>

</template>

<script setup lang="ts">

import { ref, type PropType, type Ref } from 'vue';

const props = defineProps({});
const emit = defineEmits(['locationChosen', 'locationCleared'])

const ApartmentDialog = defineAsyncComponent(() => import('@/components/AptDialog.vue'))

const showFullAptData = (item) => {
    dialog.open(ApartmentDialog, {
        data: {
            listing: item
        },
        props: {
            header: item.title,
            style: {
                width: '100vw'
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
                    // swipe(isLike.data); TODO: tag the listing through api without animation
                }, 500);
            }
        }
    })
}

</script>