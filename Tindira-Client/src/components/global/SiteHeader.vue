<template>
  <header>
    <Toolbar>
      <template #start>
        <RouterLink to="/">
          <img src="@/assets/logo.png" alt="Image" width="32" class="mx-4" />
        </RouterLink>

        <RouterLink to="/profile">
          <Button class="text-2xl" text aria-label="Profile">
            <template #icon>
              <Icon icon="mdi:user"></Icon>
            </template>
          </Button>
        </RouterLink>

        <RouterLink to="/add">
          <Button class="text-2xl" text aria-label="Add">
            <template #icon>
              <Icon icon="material-symbols:add"></Icon>
            </template>
          </Button>
        </RouterLink>
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
  </header>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useDark, useToggle } from '@vueuse/core'
import { useAppStore } from '@/stores/app'

const userStore = useAppStore()

const isDark = useDark()
const toggleDarkMode = useToggle(isDark)
</script>
