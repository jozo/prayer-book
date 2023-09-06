<script setup>
import prayers from '../prayers.js'
import {RouterLink, useRoute} from 'vue-router';
import {computed} from "vue";

const route = useRoute();
const prayersInCategory = computed(
    () => prayers.filter((item) => item.category === route.params.name)
)
</script>

<template>
  <div class="about">
    <div v-for="prayer in prayersInCategory" :key="prayer.id" class="text-lg mb-3">
      <RouterLink :to="{name: 'prayer', params: {id: prayer.id}}" class="block rounded py-2 px-3 bg-orange-200">
        {{ prayer.title }}
      </RouterLink>
    </div>
  </div>
</template>
