<template>
  <Toolbar>
    <template #start>
      <img src="../assets/logo.png" alt="Image" width="35" class="mr-4" />

      <Button class="text-2xl" text aria-label="Home" @click="navigateTo('/')">
        <template #icon>
          <Icon icon="material-symbols:home"></Icon>
        </template>
      </Button>

      <Button class="text-2xl" text aria-label="Profile" @click="navigateTo('/profile')">
        <template #icon>
          <Icon icon="mdi:user"></Icon>
        </template>
      </Button>

      <Button class="text-2xl" text aria-label="Add" @click="navigateTo('/add')">
        <template #icon>
          <Icon icon="material-symbols:add"></Icon>
        </template>
      </Button>
    </template>

    <template #center> </template>

    <template #end>
      <ProgressSpinner
        v-if="userStore.isLoading"
        style="width: 50px; height: 50px"
        strokeWidth="8"
      />

      <Button class="text-2xl" text aria-label="Add" @click="toggleDarkMode()">
        <template #icon>
          <Icon v-if="isDark" icon="ph-sun"></Icon>
          <Icon v-if="!isDark" icon="ph-moon"></Icon>
        </template>
      </Button>
    </template>
  </Toolbar>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useDark, useToggle } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/app'

const userStore = useAppStore()

const router = useRouter()

const isDark = useDark()
const toggleDarkMode = useToggle(isDark)

function navigateTo(path: string) {
  router.push(path)
}
</script>
