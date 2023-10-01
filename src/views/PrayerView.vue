<script setup>
import prayers from '../prayers.js'
import { useRoute } from 'vue-router';
import {computed} from "vue";

const route = useRoute();
const prayer = computed(() => prayers[route.params.id])

</script>

<template>
  <h2 class="mb-3 text-2xl text-center">{{ prayer.title }}</h2>
  <div v-html="prayer.content" class="leading-8"></div>
</template>
