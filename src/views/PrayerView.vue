<script setup>
import {computed} from "vue";
import BgWithHeader from "@/components/BgWithHeader.vue";
import RoundMain from "@/components/RoundMain.vue";
import {usePrayerDataStore} from "@/stores/prayerDataStore";
import {useI18n} from "vue-i18n";
import router from "@/router";
import {Parser, HtmlRenderer} from "commonmark";


const {t} = useI18n({useScope: 'global'})
const prayerDataStore = usePrayerDataStore()
const prayer = computed(() => prayerDataStore.currentPrayer)

function convertMarkdown(text) {
  if (prayer.value.categories.includes('custom')) {
    const parser = new Parser();
    const writer = new HtmlRenderer();
    const parsed = parser.parse(text);
    return writer.render(parsed);
  }
  return text
}

async function deletePrayer() {
  if (confirm(t("prayer.confirmDelete"))) {
    prayerDataStore.prayers['custom'] = prayerDataStore.prayers['custom'].filter(p => p.title !== prayer.value.title)
    await prayerDataStore.saveCustomPrayers()
    await router.push({name: 'category', params: {categoryName: 'custom'}})
  }
}
</script>

<template>
    <BgWithHeader :title="prayer.title">
    <RoundMain>
      <div v-for="prayerVersion in prayer.versions" :key="prayerVersion.name">
        <h3 v-if="prayer.versions.length > 1" class="text-2xl font-bold text-center my-2">{{prayerVersion.name}}</h3>
        <div v-html="convertMarkdown(prayerVersion.content)" class="leading-loose text-left prayer-text"></div>
      </div>

      <div v-if="prayer.categories.includes('custom')" class="flex flex-wrap justify-center space-x-4 mt-8">
        <button class="mt-4 py-2 px-10 rounded-l-full rounded-r-full bg-sky-500 dark:bg-sky-700
                       text-lg text-center text-white"
                @click.prevent="router.push({name: 'edit-prayer'})">
          {{ t("prayer.edit") }}
        </button>
        <button class="mt-4 py-2 px-10 rounded-l-full rounded-r-full bg-red-500 dark:bg-red-800
                       text-lg text-center text-white"
                @click.prevent="deletePrayer()">
          {{ t("prayer.delete") }}
        </button>
      </div>
    </RoundMain>
  </BgWithHeader>
</template>
