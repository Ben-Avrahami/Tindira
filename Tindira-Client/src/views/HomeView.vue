<template>
  <main>
    <Knob v-model="value" />
    <div>increment is {{ userStore.increment }}</div>
    <Dropdown v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Select a City"
      class="w-full md:w-[14rem]" />
    <Button @click="toggleDarkMode">
      <iconify-icon icon="mdi:home" class="mr-4"></iconify-icon>
      <span class="animate-bounce">Dark Mode Toggle</span>
    </Button>
  </main>
</template>

<script setup lang="ts">

import { useAppStore } from '../stores/app';
import { ref } from "vue";
const userStore = useAppStore();
import Knob from 'primevue/knob';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/Button';

const value = ref(0);
const selectedCity = ref();
const cities = ref([
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' }
]);
userStore.AddIncrement();

function toggleDarkMode(){
  if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
}
</script>