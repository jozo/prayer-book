<script setup>
import BgWithHeader from "@/components/BgWithHeader.vue";
import RoundMain from "@/components/RoundMain.vue";
import {usePrayerDataStore} from "@/stores/prayerDataStore";
import {useI18n} from "vue-i18n";
import router from "@/router";
import {useRoute} from "vue-router";
import {computed, onMounted, shallowRef} from "vue";
import IconBookmark from "@/components/icons/IconBookmark.vue";
import IconBookmarkSlash from "@/components/icons/IconBookmarkSlash.vue";

const {t} = useI18n({useScope: "global"});
const route = useRoute();
const lang = route.params.lang;
const isCustom = lang === "custom";
const prayerId = route.params.prayerId;
const prayerDataStore = usePrayerDataStore();

const prayer = computed(() => {
  if (isCustom) {
    return prayerDataStore.allPrayers.custom?.[prayerId];
  }
  return prayerDataStore.allPrayers[lang]?.prayers?.[prayerId];
});
const isBookmarked = computed(() => prayerDataStore.isBookmarked(lang, prayerId));
// Markdown renderer of custom prayers. Built-in prayers are compiled to HTML at build time, so
// commonmark is a separate chunk, loaded only when a custom prayer is shown.
const renderMarkdown = shallowRef(null);
const isReady = computed(() => prayer.value && (!isCustom || renderMarkdown.value));

onMounted(async () => {
  await Promise.all([prayerDataStore.loadPrayer(prayerId, lang), isCustom && loadMarkdownRenderer()]);
});

async function loadMarkdownRenderer() {
  const {Parser, HtmlRenderer} = await import("commonmark");
  const parser = new Parser();
  const writer = new HtmlRenderer();
  renderMarkdown.value = text => writer.render(parser.parse(text));
}

function convertMarkdown(text) {
  return isCustom ? renderMarkdown.value(text) : text;
}

async function deletePrayer() {
  if (confirm(t("prayer.confirmDelete"))) {
    await prayerDataStore.removePrayerFromLists(lang, prayerId);
    delete prayerDataStore.allPrayers.custom[prayerId];
    await prayerDataStore.saveCustomPrayers();
    await router.push({name: "category", params: {categoryName: "custom"}});
  }
}

async function toggleBookmark() {
  await prayerDataStore.toggleBookmark(lang, prayerId);
}
</script>

<template>
  <BgWithHeader
    v-if="isReady"
    :title="prayer.title"
  >
    <RoundMain>
      <div
        v-for="prayerVersion in prayer.versions"
        :key="prayerVersion.name"
        class="mb-4"
      >
        <h3
          v-if="prayer.versions.length > 1"
          class="text-2xl font-bold text-center my-2"
        >
          {{ prayerVersion.name }}
        </h3>
        <!-- Prayer bodies are Markdown rendered to HTML, so v-html is required here. Built-in
             prayers are compiled from the repo's TOML; custom prayers are written by the device
             owner and never leave the device, so there is no untrusted source. -->
        <!-- eslint-disable vue/no-v-html -->
        <div
          class="leading-loose text-left prayer-text"
          v-html="convertMarkdown(prayerVersion.content)"
        />
        <!-- eslint-enable vue/no-v-html -->
      </div>

      <div
        v-if="isCustom"
        class="flex flex-wrap justify-center space-x-4 mb-4"
      >
        <button
          class="mt-4 py-2 px-10 rounded-l-full rounded-r-full bg-sky-500 dark:bg-sky-700
                       text-lg text-center text-white"
          @click.prevent="router.push({name: 'edit-prayer', params: {prayerId: prayer.id}})"
        >
          {{ t("prayer.edit") }}
        </button>
        <button
          class="mt-4 py-2 px-10 rounded-l-full rounded-r-full bg-red-500 dark:bg-red-800
                       text-lg text-center text-white"
          @click.prevent="deletePrayer()"
        >
          {{ t("prayer.delete") }}
        </button>
      </div>
      <div class="flex flex-wrap justify-center space-x-4 mb-4">
        <button
          class="flex items-center mt-4 py-2 px-8 rounded-l-full rounded-r-full bg-sky-500 dark:bg-sky-700
                       text-lg text-center text-white"
          @click.prevent="toggleBookmark()"
        >
          <IconBookmarkSlash
            v-if="isBookmarked"
            class="inline-block mr-2"
          />
          <IconBookmark
            v-else
            class="inline-block mr-2"
          />
          {{ isBookmarked ? t("prayer.unbookmark") : t("prayer.bookmark") }}
        </button>
      </div>
    </RoundMain>
  </BgWithHeader>
</template>
