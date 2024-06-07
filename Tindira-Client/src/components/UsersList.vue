<template>
    <DataView :value="usersList" dataKey="username">
        <template #list="slotProps">
            <div class="grid grid-nogutter">
                <div v-for="(item, index) in slotProps.items" :key="index" class="col-12 bg-red-300 mb-5">
                    <div class="flex flex-col sm:flex-row sm:items-center p-4 gap-3"
                        :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }">
                        <div class="md:w-[10rem] relative">
                            <img class="block xl:block mx-auto rounded-md w-full" :src="item?.profilePicture" />
                        </div>
                        <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-4">
                            <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                                <div>
                                    <span class="font-medium text-secondary text-sm">{{ item?.fullName }}</span>
                                    <div class="text-lg font-medium text-surface-700 dark:text-surface-0/80 mt-2">
                                        {{ item?.profileDescription }}</div>
                                </div>
                            </div>
                            <div class="flex flex-row-reverse md:flex-row gap-2">
                                <Button severity="secondary" text rounded aria-label="Info" class="mr-2 text-3xl"
                                    @click="openWhatsAppChat(item)">
                                    <template #icon>
                                        <Icon icon="ic:round-whatsapp"></Icon>
                                    </template>
                                </Button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template #empty>
            <div class="flex text-center justify-center text-2xl">
                No Users Liked Your Listing Yet
            </div>
        </template>
    </DataView>

    <Paginator template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" :rows="itemsPerPage"
        :totalRecords="totalItems" currentPageReportTemplate="{first} to {last} of {totalRecords}" @page="changePage">
    </Paginator>

</template>

<script setup lang="ts">

import type { Listing } from '@/interfaces/listing.interface';
import { useDialog } from 'primevue/usedialog';
import { computed, defineAsyncComponent, onMounted, ref, type PropType, type Ref } from 'vue';
import { Icon } from '@iconify/vue'
import { useAppStore } from '../stores/app'
import API from '@/api';
import { inject } from 'vue';
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions';
import type { PageState } from 'primevue/paginator';
import type { SavedUser } from '@/stores/State.interface';

const userStore = useAppStore()
let itemsPerPage = ref(5)
let totalItems = ref(0)
const dialogRef = inject<Ref<DynamicDialogInstance>>('dialogRef')
let usersList = ref();
let usersListObject = ref();

const listing = dialogRef?.value.data.listing as Listing;
console.log("this is listing in usersList", listing)

onMounted(async () => {
    usersListObject.value = await API.getListingLikedBy(listing.listingId, 1, itemsPerPage.value);
    usersList = usersListObject.value.users.filter((item: any) => typeof item === 'object');
    totalItems.value = usersListObject.value.totalItems;
})

async function changePage(event: PageState) {
    await loadUsers(event.page + 1)
}

function openWhatsAppChat(user:SavedUser) {
    const whatsAppCompatiblePhoneNumber= convertPhoneNumber(user.phoneNumber);
    const url = `https://wa.me/${whatsAppCompatiblePhoneNumber}?text=Hey, im ${userStore.connectedUserObject?.fullName} and i saw you liked my listing on Tindira. i would like to know more about it.`;
    window.open(url, '_blank');
}

function convertPhoneNumber(phoneNumber:string) {
    let numberWithoutDash = phoneNumber.replace(/-/g, '');
    let convertedNumber = '972' + numberWithoutDash.substring(1);
    console.log("convereted number", convertedNumber)
    return convertedNumber;
}
async function loadUsers(page: number = 1) {
    if (typeof page !== 'number') {
        page = 1;
    }
    console.log("this is listing in usersList", listing)
    usersListObject.value = await API.getListingLikedBy(listing.listingId, 1, itemsPerPage.value);
    usersList = usersListObject.value.users.filter((item: any) => typeof item === 'object');
    totalItems.value = usersListObject.value.totalItems;
}

</script>