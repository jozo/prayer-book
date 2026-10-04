<script setup>
import {useI18n} from "vue-i18n";
import HeaderBackground from "@/components/HeaderBackground.vue";
import {ref} from "vue";
import {usePrayerDataStore} from "@/stores/prayerDataStore";
import router from "@/router";

const {t} = useI18n({useScope: "global"});
const prayerTitle = ref("");
const prayerText = ref("");
const prayerDataStore = usePrayerDataStore();

function isSaveDisabled() {
  return !prayerTitle.value || !prayerText.value;
}

async function savePrayer() {
  // The page can be opened directly, so make sure existing prayers are loaded and not overwritten
  await prayerDataStore.loadUserData();

  // Use one more than the highest existing number
  const usedIds = Object.keys(prayerDataStore.allPrayers.custom)
    .map(id => parseInt(id.replace("custom-", ""), 10))
    .filter(id => !isNaN(id));
  const nextId = usedIds.length ? Math.max(...usedIds) + 1 : 0;
  const newPrayer = {
    id: `custom-${nextId}`,
    title: prayerTitle.value,
    categories: ["custom"],
    versions: [{name: "", content: prayerText.value}],
    lang: "custom"
  };

  prayerDataStore.allPrayers.custom[newPrayer.id] = newPrayer;
  await prayerDataStore.saveCustomPrayers();
  await router.push({name: "category", params: {categoryName: "custom"}});
}
</script>

<template>
  <div
    class="w-screen z-10 px-safe"
  >
    <HeaderBackground />
    <h1
      class="mb-12 mx-5 text-4xl text-center text-white font-bold
               dark:text-gray-300"
      style="margin-top: calc(48px + env(safe-area-inset-top));"
    >
      {{ t('prayer.addPageTitle') }}
    </h1>
  </div>
  <form class="flex flex-col grow items-center h-full space-y-8 mt-8 mx-6 py-6 px-safe">
    <input
      v-model="prayerTitle"
      type="text"
      :placeholder="t('prayer.title')"
      class="flex w-full p-3 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.2)]
                  text-lg placeholder:italic bg-neutral-100 dark:bg-neutral-500 dark:text-gray-300"
      required
    >
    <textarea
      v-model="prayerText"
      :placeholder="t('prayer.text')"
      class="flex grow w-full p-3 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.2)]
                    text-lg placeholder:italic bg-neutral-100 dark:bg-neutral-500 dark:text-gray-300"
      required
    />
    <button
      :disabled="isSaveDisabled()"
      class="flex justify-center min-w-[70%] py-3 px-12 rounded-l-full rounded-r-full bg-sky-500 text-xl text-white
              disabled:opacity-50"
      @click.prevent="savePrayer()"
    >
      {{ t("prayer.save") }}
    </button>
  </form>
</template>
