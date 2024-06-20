<template>
  <div class="flex flex-col justify-center text-center gap-2 pb-2">
    <div v-if="store.connectedUserObject">
      <Transition name="fade" mode="out-in">
        <UserForm v-if="editing" :user="store.connectedUserObject" :close @dblclick="edit" />
        <ManageProfile v-else :user="store.connectedUserObject" />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'

import UserForm from '@/components/misc/profile/UserForm.vue'
import ManageProfile from '@/components/misc/profile/ManageProfile.vue'

const store = useAppStore()

const editing = ref(false)

const edit = () => {
  editing.value = true
}

const close = () => {
  editing.value = false
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
