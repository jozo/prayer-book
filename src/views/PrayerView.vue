<script setup>
import BgWithHeader from "@/components/BgWithHeader.vue";
import RoundMain from "@/components/RoundMain.vue";
import {usePrayerDataStore} from "@/stores/prayerDataStore";
import {useI18n} from "vue-i18n";
import router from "@/router";
import {useRoute} from "vue-router";
import {computed, ref, shallowRef, watch} from "vue";
import IconBookmark from "@/components/icons/IconBookmark.vue";
import IconGlobe from "@/components/icons/IconGlobe.vue";
import IconPencil from "@/components/icons/IconPencil.vue";
import TranslationSheet from "@/components/TranslationSheet.vue";
import {LanguageNames} from "@/constants";

const {t} = useI18n({useScope: "global"});
const route = useRoute();
// Switching the translation keeps this view and changes only the route, so follow its params
const lang = computed(() => route.params.lang);
const isCustom = computed(() => lang.value === "custom");
const prayerId = computed(() => route.params.prayerId);
const prayerDataStore = usePrayerDataStore();
const translationSheet = ref();

const prayer = computed(() => {
  if (isCustom.value) {
    return prayerDataStore.allPrayers.custom?.[prayerId.value];
  }
  return prayerDataStore.allPrayers[lang.value]?.prayers?.[prayerId.value];
});
const isBookmarked = computed(() => prayerDataStore.isBookmarked(lang.value, prayerId.value));
const hasTranslations = computed(() => Object.keys(prayer.value.translations ?? {}).length > 1);
// Markdown renderer of custom prayers. Built-in prayers are compiled to HTML at build time, so
// commonmark is a separate chunk, loaded only when a custom prayer is shown.
const renderMarkdown = shallowRef(null);
const isReady = computed(() => prayer.value && (!isCustom.value || renderMarkdown.value));

watch([prayerId, lang], async () => {
  // The params are gone while this view is left for another route
  if (!lang.value) {
    return;
  }
  await Promise.all([
    prayerDataStore.loadPrayer(prayerId.value, lang.value),
    isCustom.value && !renderMarkdown.value && loadMarkdownRenderer()
  ]);
  // The custom prayer was deleted, e.g. this page was reached with Back after deleting it
  if (isCustom.value && !prayer.value) {
    await router.replace({name: "category", params: {categoryName: "custom"}});
  }
}, {immediate: true});

async function loadMarkdownRenderer() {
  const {Parser, HtmlRenderer} = await import("commonmark");
  const parser = new Parser();
  const writer = new HtmlRenderer();
  renderMarkdown.value = text => writer.render(parser.parse(text));
}

function convertMarkdown(text) {
  return isCustom.value ? renderMarkdown.value(text) : text;
}

async function toggleBookmark() {
  await prayerDataStore.toggleBookmark(lang.value, prayerId.value);
}

// A new history entry, so Back returns to the previous translation
async function switchTranslation(newLang) {
  await router.push({name: "view-prayer", params: {lang: newLang, prayerId: prayerId.value}});
  window.scrollTo(0, 0);
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

      <!-- Quiet text buttons below a divider, so the actions don't compete with the prayer -->
      <div
        class="flex justify-center gap-2 pt-3 border-t border-neutral-200 text-sky-600
               dark:border-neutral-700 dark:text-sky-400"
      >
        <button
          :aria-pressed="isBookmarked"
          class="flex items-center gap-2 px-4 py-2 rounded-full active:bg-sky-500/10"
          @click="toggleBookmark()"
        >
          <IconBookmark :fill="isBookmarked ? 'currentColor' : 'none'" />
          {{ isBookmarked ? t("prayer.unbookmark") : t("prayer.bookmark") }}
        </button>
        <button
          v-if="isCustom"
          class="flex items-center gap-2 px-4 py-2 rounded-full active:bg-sky-500/10"
          @click="router.push({name: 'edit-prayer', params: {prayerId: prayer.id}})"
        >
          <IconPencil />
          {{ t("prayer.edit") }}
        </button>
        <button
          v-if="!isCustom && hasTranslations"
          :aria-label="`${t('prayer.translations')}: ${LanguageNames[lang]}`"
          aria-haspopup="dialog"
          class="flex items-center gap-2 px-4 py-2 rounded-full active:bg-sky-500/10"
          @click="translationSheet.open()"
        >
          <IconGlobe />
          {{ LanguageNames[lang] }}
        </button>
      </div>
      <TranslationSheet
        v-if="!isCustom && hasTranslations"
        ref="translationSheet"
        :title="t('prayer.translations')"
        :translations="prayer.translations"
        :current="lang"
        @select="switchTranslation"
      />
    </RoundMain>
  </BgWithHeader>
</template>
