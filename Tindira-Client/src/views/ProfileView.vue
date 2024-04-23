<template>
    <div class="flex flex-col text-center">
        <Avatar image="https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp" size="xlarge"
            shape="circle" class="mx-auto mt-10 mb-10" />
            <Textarea v-model="userDescription" autoResize rows="15" cols="30" />
    </div>

</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from 'primevue/Button'
import Avatar from 'primevue/avatar';
import Textarea from 'primevue/textarea';
import { Icon } from '@iconify/vue'
import { ref } from 'vue';

const router = useRouter()

let userDescription = ref('this is the users decription')
</script>

<style scoped></style>