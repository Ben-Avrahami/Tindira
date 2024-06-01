<template>
  <div class="flex flex-col text-center">
    <Avatar
      image="https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp"
      size="xlarge"
      shape="circle"
      class="mx-auto mt-10 mb-10"
    />
    <Textarea autoResize rows="15" cols="30" placeholder="this is the user's description" />

    <div class="flex justify-center items-center space-x-4 my-4">
      <RouterLink class="w-1/2 px-2" to="/history">
        <Button class="w-full" rounded label="Swiping History">
          <template #icon>
            <Icon icon="material-symbols:history" />
          </template>
        </Button>
      </RouterLink>

      <RouterLink class="w-1/2 px-2" to="/manage">
        <Button class="w-full" rounded label="Manage Posts">
          <template #icon>
            <Icon icon="mdi:post-it-note-edit-outline" />
          </template>
        </Button>
      </RouterLink>
    </div>

    <div class="flex justify-end items-center space-x-4">
      <div class="w-1/3 px-2">
        <Button class="w-full" rounded label="Log Out" @click="logout">
          <template #icon>
            <Icon icon="mdi:logout" />
          </template>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useAppStore } from '@/stores/app'
import router from '@/router'

const appStore = useAppStore()

const logout = () => {
  appStore.disconnectUser()
  router.push('/')
}
</script>

<style scoped></style>