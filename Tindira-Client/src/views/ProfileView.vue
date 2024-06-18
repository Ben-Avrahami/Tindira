<template>
  <div class="flex flex-col text-center gap-2 mx-2 pb-2">
    <div v-if="store.connectedUserObject">
      <UserBusinessCard :user="store.connectedUserObject" @dblclick="() => (editing = !editing)" />
    </div>

    <Divider class="w-full" />

    <div class="flex justify-between items-center gap-4">
      <RouterLink class="w-1/2" to="/history">
        <Button class="w-full" rounded label="Swiping History">
          <template #icon>
            <Icon icon="material-symbols:history" />
          </template>
        </Button>
      </RouterLink>

      <RouterLink class="w-1/2" to="/manage">
        <Button class="w-full" rounded label="Manage Posts">
          <template #icon>
            <Icon icon="mdi:post-it-note-edit-outline" />
          </template>
        </Button>
      </RouterLink>
    </div>

    <div class="flex justify-center items-center gap-4">
      <div class="w-1/3">
        <Button severity="secondary" class="w-full" rounded label="Delete" @click="confirmDelete">
          <template #icon>
            <Icon icon="mdi:trash-can" />
          </template>
        </Button>
      </div>

      <RouterLink class="w-1/3" to="/about">
        <Button class="w-full" rounded label="About">
          <template #icon>
            <Icon icon="mdi:information" />
          </template>
        </Button>
      </RouterLink>

      <div class="w-1/3">
        <Button class="w-full" rounded label="Log Out" @click="logout">
          <template #icon>
            <Icon icon="mdi:logout" />
          </template>
        </Button>
      </div>
    </div>
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useAppStore } from '@/stores/app'
import router from '@/router'
import { useConfirm } from 'primevue/useconfirm'
import { injectToast } from '@/functions/inject'
import UserBusinessCard from '@/components/misc/user_form/UserBusinessCard.vue'
import { ref } from 'vue'

const store = useAppStore()

const toast = injectToast()

const confirm = useConfirm()

const logout = () => {
  store.disconnectUser()
  router.push('/')
}

const editing = ref(false)

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
          detail: 'Deleting user is not implemented yet',
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
</script>

<style scoped></style>
