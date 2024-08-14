<template>
  <div class="flex flex-col text-center justify-center gap-5">
    <div class="flex flex-col">
      <Avatar :image="user.profilePicture" size="2xlarge" shape="circle" class="mx-auto my-6" />
      <IconField>
        <InputIcon>
          <Icon icon="mdi:rename" />
        </InputIcon>
        <InputText
          id="username"
          :value="user.username"
          type="text"
          placeholder="Username"
          disabled
        />
      </IconField>
    </div>
    <IconField>
      <InputIcon>
        <Icon icon="mdi:email" />
      </InputIcon>
      <InputText id="email" :value="user.email" type="email" placeholder="Email" disabled />
    </IconField>
    <IconField>
      <InputIcon>
        <Icon icon="mdi:user" />
      </InputIcon>
      <InputText id="name" :value="user.fullName" type="text" placeholder="Full Name" disabled />
    </IconField>
    <IconField>
      <InputIcon>
        <Icon icon="mdi:phone" />
      </InputIcon>
      <InputMask
        id="phone"
        :value="user.phoneNumber"
        mask="059-999-9999"
        placeholder="05X-XXX-XXXX"
        disabled
      />
    </IconField>
    <Textarea
      rows="10"
      cols="30"
      autoResize
      :value="user.profileDescription"
      placeholder="Profile Description"
      disabled
    />
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { SavedUser } from '@/interfaces/user.interface'

defineProps<{
  user: SavedUser
}>()
</script>

<style scoped></style>
