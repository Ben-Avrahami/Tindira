<template>
    <transition name="pop" class="fixed inset-0 flex items-center justify-center z-[50]">
        <Icon v-if="showHeart" class="w-1/2 h-1/2" icon="noto:red-heart"></Icon>
    </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const showHeart = ref(false);

function show() {
    showHeart.value = true;
    setTimeout(() => {
        showHeart.value = false;
    }, 400); // adjust delay as needed
}

</script>

<style scoped>
.pop-enter-active,
.pop-leave-active {
    animation: pop 0.4s;
}

.pop-enter {
    transform: scale(0);
}

.pop-leave-to {
    transform: scale(1.5);
}

@keyframes pop {
    0% {
        transform: scale(1.5);
    }

    100% {
        transform: scale(1);
    }
}
</style>