<script setup>
import BgWithHeader from "@/components/BgWithHeader.vue";
import RoundMain from "@/components/RoundMain.vue";
import {useI18n} from "vue-i18n";
import {Lang, PrayerFontScales} from "@/constants";
import {changeLanguage, changePrayerFontScale, getPrayerFontScale, saveFile} from "@/utils";
import {computed, ref} from "vue";
import {InvalidBackupError, usePrayerDataStore} from "@/stores/prayerDataStore";

const {t, locale} = useI18n({useScope: "global"});
const prayerDataStore = usePrayerDataStore();
const backupStatus = ref("");
const fileInput = ref();
const prayerFontScale = ref(getPrayerFontScale());
const prayerFontScaleIndex = computed(() => PrayerFontScales.indexOf(prayerFontScale.value));
const showPreview = ref(false);

async function stepPrayerFontScale(step) {
  showPreview.value = true;
  prayerFontScale.value = PrayerFontScales[prayerFontScaleIndex.value + step];
  await changePrayerFontScale(prayerFontScale.value);
}

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

          <div class="flex flex-col items-center">
            <div class="flex items-center justify-center">
              <span
                id="prayer-font-size-label"
                class="mr-2 font-bold"
              >
                {{ t('settings.fontSize.title') }}:
              </span>
              <div
                role="group"
                aria-labelledby="prayer-font-size-label"
                class="flex items-center"
              >
                <button
                  :aria-label="t('settings.fontSize.decrease')"
                  :disabled="prayerFontScaleIndex <= 0"
                  class="w-10 h-10 rounded-full text-sky-600 dark:text-sky-400 active:bg-sky-500/10
                         disabled:text-neutral-400 dark:disabled:text-neutral-500"
                  @click="stepPrayerFontScale(-1)"
                >
                  <span class="text-sm">A</span>−
                </button>
                <span
                  aria-live="polite"
                  class="w-14 tabular-nums"
                >
                  {{ Math.round(prayerFontScale * 100) }} %
                </span>
                <button
                  :aria-label="t('settings.fontSize.increase')"
                  :disabled="prayerFontScaleIndex >= PrayerFontScales.length - 1"
                  class="w-10 h-10 rounded-full text-sky-600 dark:text-sky-400 active:bg-sky-500/10
                         disabled:text-neutral-400 dark:disabled:text-neutral-500"
                  @click="stepPrayerFontScale(1)"
                >
                  <span class="text-xl">A</span>+
                </button>
              </div>
            </div>
            <!-- Shown like a prayer, so the size can be judged here, once the size is changed -->
            <figure
              v-if="showPreview"
              class="w-full mt-3 px-4 pt-2 pb-3 rounded-xl border-2 border-dashed border-neutral-300
                     dark:border-neutral-600"
            >
              <figcaption class="text-xs font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                {{ t('settings.fontSize.previewLabel') }}
              </figcaption>
              <p class="leading-loose prayer-content">
                {{ t('settings.fontSize.preview') }}
              </p>
            </figure>
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
        <p>0.13.0</p>
        <p>
          <RouterLink
            :to="{name: 'changelog'}"
            class="text-sky-600"
          >
            {{ t('changelog.title') }}
          </RouterLink>
        </p>
      </div>
    </RoundMain>
  </BgWithHeader>
</template>
