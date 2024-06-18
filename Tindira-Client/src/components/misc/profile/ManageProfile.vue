<template>
  <div class="flex flex-col justify-center text-center gap-2 pb-2">
    <UserBusinessCard :user @dblclick="showUserFormDialog" />

    <div class="grid grid-cols-3 gap-2">
      <Button severity="secondary" rounded label="Delete" @click="confirmDelete">
        <template #icon>
          <Icon icon="mdi:trash-can" />
        </template>
      </Button>
      <Button rounded label="Edit" @click="showUserFormDialog">
        <template #icon>
          <Icon icon="mdi:edit" />
        </template>
      </Button>
      <Button rounded label="Log Out" @click="logout">
        <template #icon>
          <Icon icon="mdi:logout" />
        </template>
      </Button>
    </div>
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { Icon } from '@iconify/vue'
import { useAppStore } from '@/stores/app'
import { useConfirm } from 'primevue/useconfirm'
import { injectToast } from '@/functions/inject'
import type { SavedUser } from '@/interfaces/user.interface'
import { useDialog } from 'primevue/usedialog'

import UserBusinessCard from '@/components/misc/profile/UserBusinessCard.vue'
import { defineAsyncComponent } from 'vue'

const store = useAppStore()

const toast = injectToast()

const confirm = useConfirm()

const dialog = useDialog()

const props = defineProps<{
  user: SavedUser
}>()

const logout = () => {
  store.disconnectUser()
  router.push('/')
}

const confirmDelete = async () => {
  confirm.require({
    message: 'Are you sure you want to delete your user?',
    header: 'Warning',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    accept: async () => {
      try {
        if (!store.connectedUser) throw new Error('User not connected')
        // await API.deleteUser(store.connectedUser) // TODO: Implement deleteUser in API
        // store.disconnectUser()
        // toast.add({ severity: 'info', summary: 'Confirmed', detail: 'User deleted', life: 3000 })
        // router.push('/')
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'User deletion is not implemented yet',
          life: 3000
        })
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error'
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: `Could not delete user: ${errorMessage}`,
          life: 3000
        })
      }
    }
  })
}

const UserFormDialog = defineAsyncComponent(
  () => import('@/components/misc/profile/UserFormDialog.vue')
)

const showUserFormDialog = () => {
  dialog.open(UserFormDialog, {
    data: {
      user: props.user
    },
    props: {
      header: 'Edit User',
      style: {
        width: '100%',
        maxWidth: '896px' // max-w-4xl
      },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      modal: true,
      closable: true,
      draggable: false
    }
  })
}
</script>

<style scoped></style>
