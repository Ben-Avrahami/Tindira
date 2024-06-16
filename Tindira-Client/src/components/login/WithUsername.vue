<template>
  <div class="flex flex-col items-center justify-center gap-4 w-full">
    <InputText class="w-72" id="username" v-model="username" placeholder="Username" />
    <Password
      class="w-72"
      id="password"
      v-model="password"
      placeholder="Password"
      :feedback="false"
    />
    <div class="flex justify-between w-full">
      <Button type="button" label="Cancel" severity="secondary" @click="back" />
      <Button
        type="button"
        label="Login"
        @click="loginWithUsername"
        :disabled="isAttempting || !username || !password"
      >
        <span v-if="isAttempting">One moment...</span>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  attemptLogin: (username: string, password: string) => Promise<void>
  back: () => void
}>()

const username = ref('')
const password = ref('')

const isAttempting = ref(false)

const loginWithUsername = async () => {
  isAttempting.value = true
  await props.attemptLogin(username.value, password.value)
  isAttempting.value = false
}
</script>

<style scoped></style>
