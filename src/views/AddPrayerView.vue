<script setup>
import {useI18n} from "vue-i18n";
import {ref} from "vue";
import {usePrayerDataStore} from "@/stores/prayerDataStore";
import router from "@/router";

const {t} = useI18n({useScope: 'global'})
const prayerTitle = ref("")
const prayerText = ref("")
const prayerDataStore = usePrayerDataStore()


function isSaveDisabled() {
  return !prayerTitle.value || !prayerText.value
}

async function savePrayer() {
  let nextId = Object.keys(prayerDataStore.allPrayers.custom).length
  const newPrayer = {
    id: `custom-${nextId}`,
    title: prayerTitle.value,
    categories: ['custom'],
    versions: [{name: "", content: prayerText.value}],
    lang: 'custom'
  }

  prayerDataStore.allPrayers.custom[newPrayer.id] = newPrayer
  await prayerDataStore.saveCustomPrayers()
  await router.push({name: 'category', params: {categoryName: 'custom'}})
}
</script>

<template>
  <div class="w-screen z-10 rounded-b-2xl bg-linear-to-b from-cyan-500 to-blue-500
              dark:from-cyan-800 dark:to-blue-800">
    <h1 class="mt-12 mb-12 mx-5 text-4xl text-center text-white font-bold
               dark:text-gray-300">
      {{ t('prayer.addPageTitle') }}
    </h1>
  </div>
  <form class="flex flex-col grow items-center h-full space-y-8 mt-8 p-6">
    <input type="text" :placeholder="t('prayer.title')"
           class="flex w-full p-3 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.2)]
                  text-lg placeholder:italic dark:bg-neutral-500 dark:text-gray-300"
           required v-model="prayerTitle"
    />
    <textarea :placeholder="t('prayer.text')"
              class="flex grow w-full p-3 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.2)]
                    text-lg placeholder:italic dark:bg-neutral-500 dark:text-gray-300"
              required v-model="prayerText"
    ></textarea>
    <button :disabled="isSaveDisabled()"
            class="flex justify-center min-w-[70%] py-3 px-12 rounded-l-full rounded-r-full bg-sky-500 text-xl text-white
              disabled:opacity-50"
            @click.prevent="savePrayer()">
      {{ t("prayer.save") }}
    </button>
  </form>
</template>
