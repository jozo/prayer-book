<script setup>
defineProps(['title'])
</script>

<template>
  <div class="absolute w-screen min-h-[40vh] z-10
              rounded-b-2xl bg-gradient-to-b from-cyan-500 to-blue-500
              dark:from-cyan-800 dark:to-blue-800">
  </div>
  <div class="absolute w-screen z-10">
    <h1 class="mt-12 mb-6 mx-5 text-4xl text-center text-white font-bold
               dark:text-gray-300">
      {{ title }}
    </h1>
    <slot></slot>
  </div>
</template>

<style scoped>
</style>