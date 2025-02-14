<script setup>
import BgWithHeader from "@/components/BgWithHeader.vue";
import RoundMain from "@/components/RoundMain.vue";
import {useI18n} from "vue-i18n";
import {Lang} from "@/constants";
import {Preferences} from "@capacitor/preferences";
import {usePrayerDataStore} from "@/stores/prayerDataStore";

const { t, locale } = useI18n({ useScope: 'global' })
const prayerDataStore = usePrayerDataStore()

function changeTheme(theme) {
  localStorage.setItem('theme', theme)

  if (theme === 'auto') {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  } else if (theme === 'dark') {
    if (!document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.add('dark')
    }
  } else {
    document.documentElement.classList.remove('dark')
  }
}

async function changeLanguage(language) {
  await Preferences.set({key: 'language', value: language})
  await prayerDataStore.loadPrayers(language)
}
</script>

<template>
  <BgWithHeader :title="t('menu.settings')">
    <RoundMain>
      <div class="text-base text-center">
        <div class="flex flex-col space-y-4 mb-10">
          <div class="flex justify-center">
            <div class="mr-2 font-bold" v-html="t('settings.theme.title') + ': '"></div>
            <select @change="changeTheme($event.target.value)"
                    class="pb-px border-b-2 bg-transparent border-sky-500 appearance-none text-center">
              <option value="auto" v-html="t('settings.theme.auto')"></option>
              <option value="light" v-html="t('settings.theme.light')"></option>
              <option value="dark" v-html="t('settings.theme.dark')"></option>
            </select>
          </div>

          <div class="flex justify-center">
            <div class="mr-2 font-bold" v-html="t('settings.language') + ': '"></div>
            <select @change="changeLanguage($event.target.value)"
                    v-model="locale"
                    class="pb-px border-b-2 bg-transparent border-sky-500 appearance-none text-center">
              <option v-for="[langName, langKey] in Object.entries(Lang)" :value="langKey.description">{{ langName }}</option>
            </select>
          </div>
        </div>

        <p>
          <strong>Prayer Book</strong>
        </p>
        <p>0.7.1</p>
        <p>hi@jozo.io</p>
        <p class="mb-6">
          <a href="https://codeberg.org/jozo/prayer-book" target="_blank"
             class="text-sky-600">
            codeberg.org/jozo/prayer-book
          </a>
        </p>
        <p>
          <strong>Chat - Matrix</strong>
        </p>
        <p>
          <a href="https://matrix.to/#/#prayer-book:matrix.org" rel="noopener" target="_blank"
             class="text-sky-600">
            <pre>#prayer-book:matrix.org</pre>
          </a>
        </p>
      </div>
    </RoundMain>
  </BgWithHeader>
</template>
