<template>
    <div>

        <DataView :value="listings" dataKey="listingId">
            <template #list="slotProps">
                <div class="grid grid-nogutter">
                    <div v-for="(item, index) in slotProps.items" :key="index" class="col-12 bg-red-300 mb-5">
                        <div class="flex flex-col sm:flex-row sm:items-center p-4 gap-3"
                            :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }">
                            <div class="md:w-[10rem] relative">
                                <img class="block xl:block mx-auto rounded-md w-full" :src="item?.images[0]" />
                            </div>
                            <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-4">
                                <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                                    <div>
                                        <span class="font-medium text-secondary text-sm">{{ item?.title }}</span>
                                        <div class="flex items-center">
                                            <icon icon="mdi:address-marker-outline"></icon>
                                            <p class="drag-area m-0 ">{{
                                                item?.coordinates?.formatted_address }}</p>
                                        </div>
                                        <div class="text-lg font-medium text-surface-700 dark:text-surface-0/80 mt-2">
                                            {{ item?.description }}</div>
                                    </div>
                                </div>
                                <div class="flex flex-col md:items-end gap-5">
                                    <span class="text-xl font-semibold text-surface-700 dark:text-surface-0/80">
                                        {{ item?.isPricePerWholeTime ? item?.pricePerWholeTime : item?.pricePerMonth }}
                                        ₪/{{ item?.isPricePerWholeTime ? "Whole Time" : "Month" }}
                                    </span>
                                    <div class="flex flex-row-reverse md:flex-row gap-2">
                                        <Button severity="secondary" text rounded aria-label="Info"
                                            class="mr-2 text-3xl" @click="showFullAptData(item)">
                                            <template #icon>
                                                <Icon icon="ooui:info-filled"></Icon>
                                            </template>
                                        </Button>

                                        <Button severity="secondary" text rounded aria-label="Info"
                                            class="mr-2 text-3xl" @click="showAptLikes(item)">
                                            <template #icon>
                                                <Icon icon="hugeicons:user-love-02"></Icon>
                                            </template>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template #empty>
                <div class="flex text-center justify-center text-2xl">
                    You Havent Uploaded Any Listings Yet!<br />
                    What Are You Waiting For?
                </div>
            </template>
        </DataView>

    </div>
</template>

<script setup lang="ts">

import type { Listing } from '@/interfaces/listing.interface';
import { useDialog } from 'primevue/usedialog';
import { computed, defineAsyncComponent, ref, type PropType } from 'vue';
import { Icon } from '@iconify/vue'
import { useAppStore } from '../stores/app'
import API from '@/api';

const userStore = useAppStore()

const props = defineProps({
    listings: {
        type: Array as PropType<Listing[]>,
        required: true
    },
});


const dialog = useDialog()
const UsersList = defineAsyncComponent(() => import('@/components/UsersList.vue'))

const showAptLikes = async (item: any) => {

    await dialog.open(UsersList, {
        data: {
            listing: item
        },
        props: {
            header: item.title,
            style: {
                width: '100vw',
            },
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            modal: true,
            closable: true,
        },
    })
}

const ApartmentDialog = defineAsyncComponent(() => import('@/components/AptDialog.vue'))

const showFullAptData = (item: any) => {
    dialog.open(ApartmentDialog, {
        data: {
            listing: item,
            showLikeAndDislikeButton:false
        },
        props: {
            header: item.title,
            style: {
                width: '100vw',
            },
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            modal: true,
            closable: true,
        },
    })
}

</script>