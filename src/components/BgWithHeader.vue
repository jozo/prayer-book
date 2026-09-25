<script setup>
import HeaderBackground from "@/components/HeaderBackground.vue";
defineProps({title: {type: String, required: true}});
</script>

<template>
  <div class="absolute w-screen min-h-[40vh]">
    <HeaderBackground />
  </div>
  <div class="w-screen z-10 px-safe">
    <h1
      class="mb-6 mx-5 text-4xl text-center text-white font-bold dark:text-gray-300"
      style="margin-top: calc(48px + env(safe-area-inset-top));"
    >
      {{ title }}
    </h1>
    <slot />
  </div>
</template>

<style scoped>
</style>
