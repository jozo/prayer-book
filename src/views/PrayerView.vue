<script setup>
import {useRoute} from 'vue-router';
import {computed} from "vue";
import BgWithHeader from "@/components/BgWithHeader.vue";
import RoundMain from "@/components/RoundMain.vue";
import {useI18n} from "vue-i18n";
import allPrayers from "@/prayers/all";
const { locale } = useI18n({ useScope: 'global' })


const route = useRoute();
const prayer = computed(() => allPrayers[locale.value][route.params.id])
</script>

<template>
    <BgWithHeader :title=prayer.title>
    <RoundMain>
      <div v-html="prayer.content" class="leading-loose text-left"></div>
    </RoundMain>
  </BgWithHeader>
</template>
