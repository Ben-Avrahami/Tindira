<template>
  <div class="flex flex-col text-center">
    <Avatar image="https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp" size="xlarge" shape="circle"
      class="mx-auto mt-10 mb-10" />
    <Textarea v-model="userDescription" autoResize rows="15" cols="30" />

    <div class="flex justify-center items-center space-x-4 mt-5">
      <div class="w-1/2 px-2">
        <Button class="w-full" label="Swiping History" @click="redirectToSwipingHistory">
          <template #icon>
            <Icon icon="material-symbols:history"></Icon>
          </template>
        </Button>
      </div>
      <div class="w-1/2 px-2">
        <Button class="w-full" label="Manage Posts" @click="redirectToManagePosts">
          <template #icon>
            <Icon icon="mdi:post-it-note-edit-outline"></Icon>
          </template>
        </Button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const router = useRouter()

function redirectToSwipingHistory() {
  router.push('/history')
}
function redirectToManagePosts() {
  router.push('/manage')
}

let userDescription = ref('this is the users description')
</script>

<style scoped></style>
