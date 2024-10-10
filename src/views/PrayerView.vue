<script setup>
import {computed} from "vue";
import BgWithHeader from "@/components/BgWithHeader.vue";
import RoundMain from "@/components/RoundMain.vue";
import {usePrayerDataStore} from "@/stores/prayerDataStore";


const prayerDataStore = usePrayerDataStore()
const prayer = computed(() => prayerDataStore.currentPrayer)
</script>

<template>
    <BgWithHeader :title="prayer.title">
    <RoundMain>
      <div v-for="prayerVersion in prayer.versions" :key="prayerVersion.name">
        <h3 v-if="prayer.versions.length > 1" class="text-2xl font-bold text-center my-2">{{prayerVersion.name}}</h3>
        <div v-html="prayerVersion.content" class="leading-loose text-left prayer-text"></div>
      </div>
    </RoundMain>
  </BgWithHeader>
</template>
