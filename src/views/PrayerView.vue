<script setup>
import {useRoute} from 'vue-router';
import {computed} from "vue";
import BgWithHeader from "@/components/BgWithHeader.vue";
import RoundMain from "@/components/RoundMain.vue";
import {useI18n} from "vue-i18n";
import {prayers} from "@/prayers/db";
const { locale } = useI18n({ useScope: 'global' })


const route = useRoute();
const prayerVersions = computed(() => prayers[locale.value][route.params.id])
</script>

<template>
    <BgWithHeader :title="prayerVersions[0].title">
    <RoundMain>
      <div v-for="prayerVersion in prayerVersions" :key="prayerVersion.version">
        <div v-html="prayerVersion.content" class="leading-loose text-left"></div>
      </div>
    </RoundMain>
  </BgWithHeader>
</template>
