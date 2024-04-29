<script setup>
import IconMagnifyingGlass from "@/components/icons/IconMagnifyingGlass.vue";
import IconGlobe from "@/components/icons/IconGlobe.vue";
import {useI18n} from "vue-i18n";
import {Preferences} from "@capacitor/preferences";
import router from "@/router";

const {t, locale} = useI18n({useScope: 'global'})

async function changeLanguage(language) {
  await Preferences.set({key: 'language', value: language})
}

function goToSearch() {
  router.push('category/all/')
}
</script>

<template>
  <div
      class="flex flex-col justify-center content-center min-h-[40vh] py-5 mb-16
             rounded-b-2xl bg-gradient-to-b from-cyan-500 to-blue-500">
    <!--  word-spacing is used to break after every word  -->
    <h1 class="text-5xl text-center text-white font-bold [word-spacing:100vw]">
      {{ t("prayerBook") }}
    </h1>
  </div>
  <div class="flex flex-col grow mx-5">
    <div class="flex justify-center my-4 mx-8">
      <div class="relative">
        <input type="text"
               class="flex p-2 rounded-l-full rounded-r-full shadow-[0_0_15px_rgba(0,0,0,0.2)]
            text-lg text-center placeholder:italic"
               :placeholder="t('search')"
               @click="goToSearch()"
        />
        <IconMagnifyingGlass class="absolute top-[11px] left-[8px]"/>
      </div>
    </div>

    <div class="flex flex-col grow justify-center my-4">
      <div class="flex justify-center">
        <IconGlobe class="mt-0.5 mr-1"/>
        <select @change="changeLanguage($event.target.value)"
                v-model="locale"
                class="pb-px border-b-2 bg-transparent border-sky-500 appearance-none text-center">
          <option value="en">English</option>
          <option value="sk">Slovenčina</option>
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
