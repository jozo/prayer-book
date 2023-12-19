<script setup>
import prayers from '../prayers.js'
import {useRoute} from 'vue-router';
import {computed} from "vue";
import BgWithHeader from "@/components/BgWithHeader.vue";
import RoundMain from "@/components/RoundMain.vue";

const route = useRoute();
const prayer = computed(() => prayers[route.params.id])
</script>

<template>
    <BgWithHeader :title=prayer.title>
    <RoundMain>
      <div v-html="prayer.content" class="leading-loose text-left"></div>
    </RoundMain>
  </BgWithHeader>
</template>
