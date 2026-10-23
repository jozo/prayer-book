<script setup>
import BgWithHeader from "@/components/BgWithHeader.vue";
import RoundMain from "@/components/RoundMain.vue";
import IconChevronDown from "@/components/icons/IconChevronDown.vue";
import IconChevronRight from "@/components/icons/IconChevronRight.vue";
import {useI18n} from "vue-i18n";
import {Lang, PrayerFontScales} from "@/constants";
import {changeLanguage, changePrayerFontScale, getPrayerFontScale, saveFile} from "@/utils";
import {computed, ref} from "vue";
import {InvalidBackupError, usePrayerDataStore} from "@/stores/prayerDataStore";

const {t, locale} = useI18n({useScope: "global"});
const prayerDataStore = usePrayerDataStore();
const appVersion = __APP_VERSION__;
const themes = ["auto", "light", "dark"];
const theme = ref(localStorage.getItem("theme") ?? "auto");
const backupStatus = ref("");
const fileInput = ref();
const prayerFontScale = ref(getPrayerFontScale());
const prayerFontScaleIndex = computed(() => PrayerFontScales.indexOf(prayerFontScale.value));
const showPreview = ref(false);
const historyStatus = ref("");
const hasRecentPrayers = computed(() => prayerDataStore.recentPrayers.length > 0);

prayerDataStore.loadUserData();

async function clearRecentPrayers() {
  await prayerDataStore.clearRecentPrayers();
  historyStatus.value = t("settings.history.cleared");
}

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

function changeTheme(newTheme) {
  theme.value = newTheme;
  localStorage.setItem("theme", newTheme);

  if (newTheme === "auto") {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } else if (newTheme === "dark") {
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
      <div class="text-base space-y-8">
        <section>
          <h2 class="text-xs font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            {{ t('settings.appearance') }}
          </h2>
          <div class="divide-y divide-gray-300 dark:divide-neutral-700">
            <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-5">
              <span id="theme-label">
                {{ t('settings.theme.title') }}
              </span>
              <div
                role="radiogroup"
                aria-labelledby="theme-label"
                class="flex p-0.5 rounded-full border border-sky-500/40"
              >
                <button
                  v-for="themeOption in themes"
                  :key="themeOption"
                  role="radio"
                  :aria-checked="theme === themeOption"
                  class="px-3 py-1 rounded-full"
                  :class="theme === themeOption
                    ? 'bg-sky-500 dark:bg-sky-700 text-white'
                    : 'text-sky-600 dark:text-sky-400 active:bg-sky-500/10'"
                  @click="changeTheme(themeOption)"
                >
                  {{ t(`settings.theme.${themeOption}`) }}
                </button>
              </div>
            </div>

            <div class="py-5">
              <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <span id="prayer-font-size-label">
                  {{ t('settings.fontSize.title') }}
                </span>
                <div
                  role="group"
                  aria-labelledby="prayer-font-size-label"
                  class="flex items-center"
                >
                  <button
                    :aria-label="t('settings.fontSize.decrease')"
                    :disabled="prayerFontScaleIndex <= 0"
                    class="w-10 h-10 rounded-full border border-sky-500/40 text-sky-600 dark:text-sky-400 active:bg-sky-500/10
                           disabled:border-neutral-300 disabled:text-neutral-400 dark:disabled:border-neutral-600
                           dark:disabled:text-neutral-500"
                    @click="stepPrayerFontScale(-1)"
                  >
                    <span class="text-sm">A</span>−
                  </button>
                  <span
                    aria-live="polite"
                    class="w-20 text-center tabular-nums"
                  >
                    {{ Math.round(prayerFontScale * 100) }} %
                  </span>
                  <button
                    :aria-label="t('settings.fontSize.increase')"
                    :disabled="prayerFontScaleIndex >= PrayerFontScales.length - 1"
                    class="w-10 h-10 rounded-full border border-sky-500/40 text-sky-600 dark:text-sky-400 active:bg-sky-500/10
                           disabled:border-neutral-300 disabled:text-neutral-400 dark:disabled:border-neutral-600
                           dark:disabled:text-neutral-500"
                    @click="stepPrayerFontScale(1)"
                  >
                    <span class="text-xl">A</span>+
                  </button>
                </div>
              </div>
              <!-- Shown like a prayer, so the size can be judged here, once the size is changed -->
              <figure
                v-if="showPreview"
                class="mt-3 px-4 pt-2 pb-3 rounded-xl bg-white dark:bg-neutral-700/50"
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
        </section>

        <section>
          <h2 class="text-xs font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            <label for="language-select">
              {{ t('settings.language') }}
            </label>
          </h2>
          <div class="relative mt-1">
            <select
              id="language-select"
              v-model="locale"
              class="w-full py-2 pl-4 pr-10 rounded-lg border border-sky-500/40 bg-transparent appearance-none
                     dark:[color-scheme:dark]"
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
            <IconChevronDown
              class="absolute right-3 top-1/2 -translate-y-1/2 w-5! h-5! pointer-events-none
                     text-sky-600 dark:text-sky-400"
            />
          </div>
        </section>

        <section aria-labelledby="history-heading">
          <h2
            id="history-heading"
            class="text-xs font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
          >
            {{ t('settings.history.title') }}
          </h2>
          <p class="mt-1 mb-4 text-sm text-neutral-500 dark:text-neutral-400">
            {{ t('settings.history.description') }}
          </p>
          <button
            :disabled="!hasRecentPrayers"
            class="w-full py-2 rounded-l-full rounded-r-full bg-sky-500 dark:bg-sky-700 text-white
                   disabled:bg-neutral-300 disabled:text-neutral-500 dark:disabled:bg-neutral-700 dark:disabled:text-neutral-400"
            @click="clearRecentPrayers()"
          >
            {{ t('settings.history.clear') }}
          </button>
          <p
            role="status"
            class="italic"
            :class="{'mt-4': historyStatus}"
          >
            {{ historyStatus }}
          </p>
        </section>

        <section aria-labelledby="backup-heading">
          <h2
            id="backup-heading"
            class="text-xs font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
          >
            {{ t('settings.backup.title') }}
          </h2>
          <p class="mt-1 mb-4 text-sm text-neutral-500 dark:text-neutral-400">
            {{ t('settings.backup.description') }}
          </p>
          <div class="flex gap-4">
            <button
              class="flex-1 py-2 rounded-l-full rounded-r-full bg-sky-500 dark:bg-sky-700 text-white"
              @click="exportBackup()"
            >
              {{ t('settings.backup.export') }}
            </button>
            <button
              class="flex-1 py-2 rounded-l-full rounded-r-full bg-sky-500 dark:bg-sky-700 text-white"
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
            class="italic"
            :class="{'mt-4': backupStatus}"
          >
            {{ backupStatus }}
          </p>
        </section>

        <section>
          <h2 class="text-xs font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            {{ t('settings.about') }}
          </h2>
          <div class="divide-y divide-gray-300 dark:divide-neutral-700">
            <p class="flex justify-between py-3">
              <strong>Prayer Book</strong>
              <span class="tabular-nums">{{ appVersion }}</span>
            </p>
            <RouterLink
              :to="{name: 'changelog'}"
              class="flex items-center justify-between py-3 text-sky-600 dark:text-sky-400"
            >
              {{ t('changelog.title') }}
              <IconChevronRight class="w-5! h-5!" />
            </RouterLink>
          </div>
        </section>
      </div>
    </RoundMain>
  </BgWithHeader>
</template>
