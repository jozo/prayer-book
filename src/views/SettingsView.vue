<script setup>
import BgWithHeader from "@/components/BgWithHeader.vue";
import RoundMain from "@/components/RoundMain.vue";
import {useI18n} from "vue-i18n";

const { t } = useI18n({ useScope: 'global' })

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
</script>

<template>
  <BgWithHeader :title="t('menu.settings')">
    <RoundMain>
      <div class="text-base text-center">
        <div class="flex justify-center mb-10">
          <div class="mr-2 font-bold" v-html="t('settings.theme.title') + ': '"></div>
          <select @change="changeTheme($event.target.value)"
              class="pb-px border-b-2 bg-transparent border-sky-500 appearance-none text-center">
            <option value="auto" v-html="t('settings.theme.auto')"></option>
            <option value="light" v-html="t('settings.theme.light')"></option>
            <option value="dark" v-html="t('settings.theme.dark')"></option>
          </select>
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
