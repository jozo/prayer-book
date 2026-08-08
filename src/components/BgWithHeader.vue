<script setup>
defineProps({title: {type: String, required: true}});
</script>

<template>
  <div
    class="absolute w-screen min-h-[40vh] z-10
              rounded-b-2xl bg-linear-to-b from-cyan-500 to-blue-500
              dark:from-cyan-800 dark:to-blue-800"
  />
  <div class="w-screen z-10">
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
