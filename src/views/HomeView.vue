<script setup>
import IconMagnifyingGlass from "@/components/icons/IconMagnifyingGlass.vue";
import IconGlobe from "@/components/icons/IconGlobe.vue";
import HeaderBackground from "@/components/HeaderBackground.vue";
import {useI18n} from "vue-i18n";
import router from "@/router";
import {Lang} from "@/constants";
import {changeLanguage} from "@/utils";

const {t, locale} = useI18n({useScope: "global"});

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
    <!--    <div class="my-4">-->
    <!--      <div class="text-sm mb-1">Continue with:</div>-->
    <!--      <div class="flex flex-row flex-wrap text-sm">-->
    <!--        <a href="#"-->
    <!--           class="mr-2 my-1 px-3 py-1 rounded-l-full rounded-r-full bg-gray-300 text-gray-700">-->
    <!--          Our Father-->
    <!--        </a>-->
    <!--        <a href="#"-->
    <!--           class="mr-2 my-1 px-3 py-1 rounded-l-full rounded-r-full bg-gray-300 text-gray-700">-->
    <!--          Hail, Mary-->
    <!--        </a>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>
