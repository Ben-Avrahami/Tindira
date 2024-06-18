<template>
  <div>
    <div
      class="scaler max-w-[400px] mx-auto mt-[-12.5%] mb-[-12.5%] md:mt-[-6.25%] md:mb-[-6.25%] aspect-w-3 aspect-h-2"
    >
      <button class="card block relative z-10 p-3 w-full h-full">
        <UserForm :user :editable="false" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SavedUser } from '@/stores/State.interface'
import UserForm from './UserForm.vue'

defineProps<{
  user: SavedUser
}>()
</script>

<style scoped>
.scaler {
  transform: scale(0.7, 0.7);
}

.card {
  background-image: url('https://tindira.s3.us-east-2.amazonaws.com/visit-card-texture.jpg');
  transform: scale(0.5, 0.5) rotateX(60deg) rotateY(0deg) rotateZ(45deg);
  box-shadow: 0;
  transition: transform 0.6s ease, box-shadow 0.6s ease;
  box-shadow: 13px 13px 13px rgba(0, 0, 0, 0.4);
}

.card:hover {
  cursor: pointer;
  transform: scale(0.5, 0.5) rotateX(60deg) rotateY(0deg) rotateZ(45deg) translateZ(25px);
  box-shadow: 21px 21px 21px rgba(0, 0, 0, 0.4);
}

.card:focus {
  transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(10px);
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.4);
}

.card:focus::before {
  transform: skewX(0deg) translateX(0px) translateY(0px);
  height: 0px;
}

.card:focus::after {
  transform: skewY(0deg) translateX(0px) translateY(0px);
  width: 0px;
}

.card::before,
.card::after {
  content: '';
  position: absolute;
  display: block;
  background-color: grey;
  transition: transform 0.6s ease, height 0.6s ease, width 0.6s ease;
}

.card::before {
  width: 100%;
  height: 12px;
  bottom: 0;
  left: 0;
  transform: skewX(45deg) translateX(-6px) translateY(12px);
}

.card::after {
  height: 100%;
  width: 12px;
  top: 0;
  right: 0;
  transform: skewY(45deg) translateX(12px) translateY(-6px);
}
</style>
