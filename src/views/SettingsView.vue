<script setup>
import BgWithHeader from "@/components/BgWithHeader.vue";
import RoundMain from "@/components/RoundMain.vue";
import {useI18n} from "vue-i18n";
import {Lang} from "@/constants";
import {changeLanguage} from "@/utils";

const {t, locale} = useI18n({useScope: "global"});

function changeTheme(theme) {
  localStorage.setItem("theme", theme);

  if (theme === "auto") {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } else if (theme === "dark") {
    if (!document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.add("dark");
    }
  } else {
    document.documentElement.classList.remove("dark");
  }
}
</script>

<template>
  <BgWithHeader :title="t('menu.settings')">
    <RoundMain>
      <div class="text-base text-center">
        <div class="flex flex-col space-y-4 mb-10">
          <div class="flex justify-center">
            <label
              for="theme-select"
              class="mr-2 font-bold"
            >
              {{ t('settings.theme.title') }}:
            </label>
            <select
              id="theme-select"
              class="pb-px border-b-2 bg-transparent border-sky-500 appearance-none text-center"
              @change="changeTheme($event.target.value)"
            >
              <option value="auto">
                {{ t('settings.theme.auto') }}
              </option>
              <option value="light">
                {{ t('settings.theme.light') }}
              </option>
              <option value="dark">
                {{ t('settings.theme.dark') }}
              </option>
            </select>
          </div>

          <div class="flex justify-center">
            <label
              for="language-select"
              class="mr-2 font-bold"
            >
              {{ t('settings.language') }}:
            </label>
            <select
              id="language-select"
              v-model="locale"
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

        <p>
          <strong>Prayer Book</strong>
        </p>
        <p>0.11.0</p>
        <p>hi@jozo.io</p>
        <p>
          <a
            href="https://codeberg.org/jozo/prayer-book"
            target="_blank"
            class="text-sky-600"
          >
            codeberg.org/jozo/prayer-book
          </a>
        </p>
      </div>
    </RoundMain>
  </BgWithHeader>
</template>
