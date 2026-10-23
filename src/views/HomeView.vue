<script setup>
import IconMagnifyingGlass from "@/components/icons/IconMagnifyingGlass.vue";
import IconGlobe from "@/components/icons/IconGlobe.vue";
import HeaderBackground from "@/components/HeaderBackground.vue";
import {useI18n} from "vue-i18n";
import router from "@/router";
import {Lang, LanguageNames} from "@/constants";
import {changeLanguage} from "@/utils";
import {usePrayerDataStore} from "@/stores/prayerDataStore";
import {computed} from "vue";

const {t, locale} = useI18n({useScope: "global"});
const prayerDataStore = usePrayerDataStore();
const recentPrayers = computed(() => prayerDataStore.resolveRecentPrayers());

prayerDataStore.loadRecentPrayerLanguages();

function goToSearch() {
  // Ask the search view to focus its input, so the user can start typing right away
  router.push({name: "category", params: {categoryName: "all"}, state: {focusSearch: true}});
}
</script>

<template>
  <div
    class="flex flex-col justify-center content-center min-h-[40vh] pb-5 mb-16 px-safe"
    style="padding-top: calc(1.25rem + env(safe-area-inset-top));"
  >
    <HeaderBackground />
    <!--  word-spacing is used to break after every word  -->
    <h1
      class="text-5xl text-center text-white font-bold [word-spacing:100vw]
               dark:text-gray-300"
    >
      {{ t("prayerBook") }}
    </h1>
  </div>
  <div class="flex flex-col grow mx-5 px-safe">
    <div class="flex justify-center my-4 mx-8">
      <div class="relative">
        <!-- Read-only, so tapping it does not open the keyboard before the search view is shown -->
        <input
          type="text"
          readonly
          class="flex p-2 rounded-l-full rounded-r-full shadow-[0_0_15px_rgba(0,0,0,0.2)]
                      bg-white text-lg text-center text-gray-700 placeholder:italic placeholder:text-gray-500
                      outline-none focus:ring-2 focus:ring-sky-500 dark:bg-neutral-700 dark:text-gray-100 dark:placeholder:text-neutral-400"
          :placeholder="t('search')"
          @click="goToSearch()"
        >
        <IconMagnifyingGlass class="absolute top-[11px] left-[8px] pointer-events-none text-gray-500 dark:text-neutral-400" />
      </div>
    </div>

    <div class="flex flex-col grow justify-center my-4">
      <div class="flex justify-center">
        <IconGlobe class="mt-0.5 mr-1" />
        <select
          v-model="locale"
          :aria-label="t('settings.language')"
          class="pb-px border-b-2 bg-transparent border-sky-500 appearance-none text-center"
          @change="changeLanguage($event.target.value)"
        >
          <option
            v-for="(langCode, langName) in Lang"
            :key="langCode"
            :value="langCode"
          >
            {{ langName }}
          </option>
        </select>
      </div>
    </div>
    <section
      v-if="recentPrayers.length"
      aria-labelledby="recent-prayers-heading"
      class="mb-8"
    >
      <h2
        id="recent-prayers-heading"
        class="mb-3 text-xs font-bold uppercase tracking-wide text-center text-neutral-500 dark:text-neutral-400"
      >
        {{ t("home.recent") }}
      </h2>
      <!-- A pill is at most half a row wide minus half the gap, so two always fit on a row
           and the five recent prayers take at most three rows -->
      <div class="flex flex-wrap justify-center gap-2">
        <RouterLink
          v-for="recent in recentPrayers"
          :key="recent.prayerId"
          :to="{name: 'view-prayer', params: {lang: recent.lang, prayerId: recent.prayerId}}"
          class="flex items-center gap-2 max-w-[calc(50%-0.25rem)] min-h-9 px-4 rounded-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.15)]
                 text-gray-700 active:bg-sky-50 dark:bg-neutral-700 dark:text-gray-100 dark:active:bg-neutral-600"
        >
          <span
            class="truncate"
            :lang="recent.lang === 'custom' ? undefined : recent.lang"
          >
            {{ recent.title }}
          </span>
          <!-- Prayers opened in another language than the app's are marked with its code -->
          <span
            v-if="recent.lang !== 'custom' && recent.lang !== locale"
            class="text-xs font-bold uppercase text-sky-600 dark:text-sky-400"
            :title="LanguageNames[recent.lang]"
          >
            {{ recent.lang }}
          </span>
        </RouterLink>
      </div>
    </section>
  </div>
</template>
