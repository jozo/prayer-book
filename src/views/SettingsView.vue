<script setup>
import BgWithHeader from "@/components/BgWithHeader.vue";
import RoundMain from "@/components/RoundMain.vue";
import {useI18n} from "vue-i18n";
import {Lang} from "@/constants";
import {changeLanguage, saveFile} from "@/utils";
import {ref} from "vue";
import {InvalidBackupError, usePrayerDataStore} from "@/stores/prayerDataStore";

const {t, locale} = useI18n({useScope: "global"});
const prayerDataStore = usePrayerDataStore();
const backupStatus = ref("");
const fileInput = ref();

async function exportBackup() {
  backupStatus.value = "";
  const data = await prayerDataStore.exportUserData();
  const date = data.exportedAt.slice(0, 10);
  await saveFile(`prayer-book-backup-${date}.json`, JSON.stringify(data, null, 2));
}

async function importBackup(event) {
  const file = event.target.files[0];
  // Clear the input, so picking the same file again triggers another import
  event.target.value = "";
  if (!file) {
    return;
  }
  try {
    let data;
    try {
      data = JSON.parse(await file.text());
    } catch {
      throw new InvalidBackupError();
    }
    const imported = await prayerDataStore.importUserData(data);
    backupStatus.value = t("settings.backup.imported", imported);
  } catch (error) {
    if (!(error instanceof InvalidBackupError)) {
      console.error("Error importing backup:", error);
    }
    backupStatus.value = t("settings.backup.invalidFile");
  }
}

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

        <div class="flex flex-col items-center mb-10">
          <h2 class="font-bold">
            {{ t('settings.backup.title') }}
          </h2>
          <p class="mt-1 mb-4">
            {{ t('settings.backup.description') }}
          </p>
          <div class="flex space-x-4">
            <button
              class="py-2 px-8 rounded-l-full rounded-r-full bg-sky-500 dark:bg-sky-700 text-white"
              @click="exportBackup()"
            >
              {{ t('settings.backup.export') }}
            </button>
            <button
              class="py-2 px-8 rounded-l-full rounded-r-full bg-sky-500 dark:bg-sky-700 text-white"
              @click="fileInput.click()"
            >
              {{ t('settings.backup.import') }}
            </button>
          </div>
          <!-- No accept filter: Android file pickers often report backups as a generic file type -->
          <input
            ref="fileInput"
            type="file"
            class="hidden"
            @change="importBackup($event)"
          >
          <p
            role="status"
            class="mt-4 italic"
          >
            {{ backupStatus }}
          </p>
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
