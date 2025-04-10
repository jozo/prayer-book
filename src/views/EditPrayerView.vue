<script setup>
import {useI18n} from "vue-i18n";
import {computed, onMounted, ref} from "vue";
import {usePrayerDataStore} from "@/stores/prayerDataStore";
import router from "@/router";
import {useRoute} from "vue-router";
import {isEmpty} from "@/utils";

const {t} = useI18n({useScope: 'global'})
const route = useRoute();
const prayerDataStore = usePrayerDataStore()
const prayer = computed(() => prayerDataStore.allPrayers.custom?.[route.params.prayerId])
const prayerTitle = ref()
const prayerText = ref()

onMounted(async () => {
  if (isEmpty(prayerDataStore.allPrayers.custom)) {
    await prayerDataStore.loadCustomPrayers()
  }
  prayerTitle.value = prayer.value.title
  prayerText.value = prayer.value.versions[0].content
})

function isSaveDisabled() {
  return !prayerTitle.value || !prayerText.value
}

async function savePrayer() {
  prayer.value.title = prayerTitle.value
  prayer.value.versions[0].content = prayerText.value
  await prayerDataStore.saveCustomPrayers()
  await router.push({name: 'view-prayer', params: {prayerId: prayer.value.id, lang: 'custom'}})
}
</script>

<template>
  <div class="w-screen z-10 rounded-b-2xl bg-gradient-to-b from-cyan-500 to-blue-500
              dark:from-cyan-800 dark:to-blue-800">
    <h1 class="mt-12 mb-12 mx-5 text-4xl text-center text-white font-bold
               dark:text-gray-300">
      {{ t('prayer.editPageTitle') }}
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
            class="flex justify-center min-w-[70%] py-3 px-12 rounded-l-full rounded-r-full bg-sky-500 dark:bg-sky-700
                   text-xl text-white disabled:opacity-50"
            @click.prevent="savePrayer()">
      {{ t("prayer.save") }}
    </button>
  </form>
</template>
