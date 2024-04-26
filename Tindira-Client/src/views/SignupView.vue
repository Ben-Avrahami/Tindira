<template>
  <div class="card flex justify-center">
    <Stepper v-model:activeStep="active">
      <StepperPanel>
        <template #header="{ index, clickCallback }">
          <StepperIcon :icon="'mdi:user'" :colorize="index <= active" @click="clickCallback" />
        </template>
        <template #content="{ nextCallback }">
          <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 20rem">
            <StepperTitle title="Let's create your account!" />
            <div class="mb-4">
              <IconField>
                <InputIcon>
                  <Icon icon="mdi:user" />
                </InputIcon>
                <InputText id="input" v-model="name" type="text" placeholder="Name" />
              </IconField>
            </div>
            <div class="mb-4">
              <IconField>
                <InputIcon>
                  <Icon icon="mdi:email" />
                </InputIcon>
                <InputText id="email" v-model="email" type="email" placeholder="Email" />
              </IconField>
            </div>
            <div class="mb-4">
              <Password v-model="password" toggleMask placeholder="Password" class="w-full" />
            </div>
          </div>
          <div class="flex pt-4 justify-end">
            <NextButton @click="nextCallback" />
          </div>
        </template>
      </StepperPanel>
      <StepperPanel>
        <template #header="{ index, clickCallback }">
          <StepperIcon :icon="'mdi:star'" :colorize="index <= active" @click="clickCallback" />
        </template>
        <template #content="{ prevCallback, nextCallback }">
          <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 24rem">
            <StepperTitle title="Select your interests" />
            <div class="flex flex-wrap justify-center gap-3">
              <ToggleButton v-model="option1" onLabel="Nature" offLabel="Nature" />
              <ToggleButton v-model="option2" onLabel="Art" offLabel="Art" />
              <ToggleButton v-model="option3" onLabel="Music" offLabel="Music" />
              <ToggleButton v-model="option4" onLabel="Design" offLabel="Design" />
              <ToggleButton v-model="option5" onLabel="Photography" offLabel="Photography" />
              <ToggleButton v-model="option6" onLabel="Movies" offLabel="Movies" />
              <ToggleButton v-model="option7" onLabel="Sports" offLabel="Sports" />
              <ToggleButton v-model="option8" onLabel="Gaming" offLabel="Gaming" />
              <ToggleButton v-model="option9" onLabel="Traveling" offLabel="Traveling" />
              <ToggleButton v-model="option10" onLabel="Dancing" offLabel="Dancing" />
            </div>
          </div>
          <div class="flex pt-4 justify-between">
            <BackButton @click="prevCallback" />
            <NextButton @click="nextCallback" />
          </div>
        </template>
      </StepperPanel>
      <StepperPanel>
        <template #header="{ index, clickCallback }">
          <StepperIcon :icon="'mdi:check'" :colorize="index <= active" @click="clickCallback" />
        </template>
        <template #content="{ prevCallback }">
          <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 24rem">
            <StepperTitle title="You're all set!" />
            <div class="flex justify-center">
              <img
                alt="logo"
                src="https://primefaces.org/cdn/primevue/images/stepper/content.svg"
              />
            </div>
          </div>
          <div class="flex pt-4 justify-start">
            <BackButton @click="prevCallback" />
          </div>
        </template>
      </StepperPanel>
    </Stepper>
  </div>
</template>

<script setup lang="ts">
import NextButton from '@/components/signup/NextButton.vue'
import BackButton from '@/components/signup/BackButton.vue'
import StepperIcon from '@/components/signup/StepperIcon.vue'
import { ref } from 'vue'
import StepperTitle from '@/components/signup/StepperTitle.vue'
import { Icon } from '@iconify/vue/dist/iconify.js'

const active = ref(0)
const completed = ref(false)
const products = ref()
const name = ref()
const email = ref()
const password = ref()
const option1 = ref(false)
const option2 = ref(false)
const option3 = ref(false)
const option4 = ref(false)
const option5 = ref(false)
const option6 = ref(false)
const option7 = ref(false)
const option8 = ref(false)
const option9 = ref(false)
const option10 = ref(false)
</script>

<style scoped>
.p-stepper {
  flex-basis: 40rem;
}
</style>
