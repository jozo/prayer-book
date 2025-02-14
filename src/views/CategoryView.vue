<script setup>
import {useRoute} from 'vue-router';
import {computed, ref, watch} from "vue";
import IconMagnifyingGlass from "@/components/icons/IconMagnifyingGlass.vue";
import IconChevronRight from "@/components/icons/IconChevronRight.vue";
import BgWithHeader from "@/components/BgWithHeader.vue";
import RoundMain from "@/components/RoundMain.vue";
import {useI18n} from "vue-i18n";
import {usePrayerDataStore} from "@/stores/prayerDataStore";
import router from "@/router";

const {t, locale} = useI18n({useScope: 'global'})
const route = useRoute();
const searchText = ref("")
const prayerDataStore = usePrayerDataStore()

function clean(value) {
  return value.normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLocaleLowerCase(locale.value)
}

const prayersInCategory = computed(
    () => {
      let selectedPrayers;

      if (route.params.categoryName === "all") {
        selectedPrayers = {}
        for (const category in prayerDataStore.prayers) {
          for (const prayer of prayerDataStore.prayers[category]) {
            selectedPrayers[prayer.title] = prayer
          }
        }
        selectedPrayers = Object.values(selectedPrayers)
      } else {
        selectedPrayers = prayerDataStore.prayers[route.params.categoryName] || []
      }

      if (searchText.value !== "") {
        selectedPrayers = selectedPrayers
          .filter((item) => (clean(item.title).indexOf(clean(searchText.value)) >= 0))
      }
      // sort by title by locale/language conventions
      return selectedPrayers
          .sort((a, b) => a.title.localeCompare(b.title, locale.value))
    }
)

watch(() => route.params.name, async () => { searchText.value = "" })

function navigateToPrayer(prayer) {
  prayerDataStore.setCurrentPrayer(prayer)
  router.push({name: 'view-prayer'})
}
</script>

<template>
  <BgWithHeader :title="t(`category.${route.params.categoryName}`)">
    <div class="flex flex-col">
      <div class="flex justify-center content-center mb-6 mx-8">
        <div class="relative">
          <input type="text"
                 class="flex p-2 rounded-l-full rounded-r-full shadow-[0_0_15px_rgba(0,0,0,0.2)]
                  text-lg text-center placeholder:italic dark:bg-neutral-500 dark:text-gray-300"
                 autofocus
                 :placeholder="t('search')"
                 v-model="searchText"
                 @input="searchText = $event.target.value"
          />
          <IconMagnifyingGlass class="absolute top-[11px] left-[8px]"/>
        </div>
      </div>
      <RoundMain>
        <div class="-my-4 flex flex-col">
          <button
              v-if="route.params.categoryName === 'custom'"
              class="flex justify-center mt-4 py-2 px-12 rounded-l-full rounded-r-full bg-sky-500 dark:bg-sky-700 text-xl text-white"
              @click.prevent="router.push({name: 'add-prayer'})">
            {{ t('prayer.addPageTitle') }}
          </button>

          <div v-if="prayersInCategory.length === 0" class="text-center text-xl py-5 italic">
            {{ t('prayer.notFound') }}
          </div>
          <div v-else>
            <div v-for="prayer in prayersInCategory" :key="prayer.title" class="group flex items-center text-xl">
              <button @click="navigateToPrayer(prayer)"
                      class="py-5 grow border-b border-gray-300 group-last:border-0 text-left">
                {{ prayer.title }}
              </button>
              <IconChevronRight class="ml-6"/>
            </div>
          </div>
        </div>
      </RoundMain>
    </div>
  </BgWithHeader>
</template>
