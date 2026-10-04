<script setup>
import {useRoute} from "vue-router";
import {computed, onMounted, ref, useTemplateRef, watch} from "vue";
import IconMagnifyingGlass from "@/components/icons/IconMagnifyingGlass.vue";
import IconChevronRight from "@/components/icons/IconChevronRight.vue";
import BgWithHeader from "@/components/BgWithHeader.vue";
import RoundMain from "@/components/RoundMain.vue";
import {useI18n} from "vue-i18n";
import {usePrayerDataStore} from "@/stores/prayerDataStore";
import router from "@/router";

const {t, locale} = useI18n({useScope: "global"});
const lang = locale.value;
const route = useRoute();
const prayerDataStore = usePrayerDataStore();

const allPrayers = computed(() => prayerDataStore.allPrayers);
const searchText = ref("");
const searchInput = useTemplateRef("searchInput");
const isLoading = ref(true);

const categoryName = computed(() => route.params.categoryName);

const prayersInCategory = computed(() => {
  let prayers = [];

  if (!allPrayers.value[lang]) {
    return prayers;
  }

  if (categoryName.value === "all") {
    prayers = getPrayersFromAllCategories();
  } else if (categoryName.value === "bookmarks") {
    prayers = getBookmarkedPrayers();
  } else if (categoryName.value === "custom") {
    prayers = getCustomPrayers();
  } else {
    prayers = allPrayers.value[lang].categories?.[categoryName.value] ?? [];
  }

  if (searchText.value !== "") {
    const search = clean(searchText.value);
    prayers = prayers.filter(item => clean(item.title).includes(search));
  }
  // Sort a copy by title by locale/language conventions, the store's arrays must stay untouched
  return [...prayers].sort((a, b) => a.title.localeCompare(b.title, locale.value));
});

// The view stays mounted when navigating between categories, so load on every category change
watch(categoryName, async (name) => {
  searchText.value = "";
  isLoading.value = true;
  if (name === "bookmarks") {
    // Bookmarks can point to other languages, which are loaded only for this list
    await Promise.all([prayerDataStore.loadPrayers(lang), prayerDataStore.loadBookmarkedPrayers()]);
  } else {
    await prayerDataStore.loadPrayers(lang);
  }
  isLoading.value = false;
}, {immediate: true});

onMounted(() => {
  // Set when coming from the search box on the home page
  if (history.state?.focusSearch) {
    searchInput.value.focus();
    // Focus only once, not again when returning to this page with the back button
    history.replaceState({...history.state, focusSearch: false}, "");
  }
});

function clean(value) {
  return value.normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase(locale.value);
}

function getPrayersFromAllCategories() {
  // A prayer can be in several categories, keep it only once
  const prayers = {};
  for (const category in allPrayers.value[lang].categories) {
    for (const prayer of allPrayers.value[lang].categories[category]) {
      prayers[prayer.id] = prayer;
    }
  }
  return [...Object.values(prayers), ...getCustomPrayers()];
}

function getCustomPrayers() {
  return Object.values(allPrayers.value.custom);
}

function getBookmarkedPrayers() {
  const prayers = [];
  for (const lang in allPrayers.value.bookmarks) {
    for (const prayerId in allPrayers.value.bookmarks[lang]) {
      let prayer;

      if (lang === "custom") {
        prayer = allPrayers.value.custom[prayerId];
      } else {
        prayer = allPrayers.value[lang]?.prayers?.[prayerId];
      }
      // Skip bookmarks of prayers that no longer exist, e.g. removed or renamed in an app update
      if (!prayer) {
        continue;
      }
      prayers.push({id: prayer.id, title: prayer.title, lang});
    }
  }
  return prayers;
}

function navigateToPrayer(prayer) {
  const language = prayer.lang || lang;
  router.push({name: "view-prayer", params: {lang: language, prayerId: prayer.id}});
}
</script>

<template>
  <BgWithHeader :title="t(`category.${categoryName}`)">
    <div class="flex flex-col">
      <div class="flex justify-center content-center mb-6 mx-8">
        <div class="relative">
          <input
            ref="searchInput"
            v-model="searchText"
            type="text"
            class="flex p-2 rounded-l-full rounded-r-full shadow-[0_0_15px_rgba(0,0,0,0.2)]
                  bg-white text-lg text-center text-gray-700 placeholder:italic placeholder:text-gray-500
                  outline-none focus:ring-2 focus:ring-white/80 dark:bg-neutral-700 dark:text-gray-100 dark:placeholder:text-neutral-400"
            :placeholder="t('search')"
            @input="searchText = $event.target.value"
          >
          <IconMagnifyingGlass class="absolute top-[11px] left-[8px] pointer-events-none text-gray-500 dark:text-neutral-400" />
        </div>
      </div>
      <RoundMain>
        <div class="-my-4 flex flex-col">
          <button
            v-if="categoryName === 'custom'"
            class="flex justify-center mt-4 py-2 px-12 rounded-l-full rounded-r-full bg-sky-500 dark:bg-sky-700 text-xl text-white"
            @click.prevent="router.push({name: 'add-prayer'})"
          >
            {{ t('prayer.addPageTitle') }}
          </button>

          <div
            v-if="!isLoading && prayersInCategory.length === 0"
            class="text-center text-xl py-5 italic"
          >
            {{ t('prayer.notFound') }}
          </div>
          <div v-else>
            <div
              v-for="prayer in prayersInCategory"
              :key="`${prayer.lang || lang}/${prayer.id}`"
              class="group flex items-center text-xl"
            >
              <button
                class="py-5 grow border-b border-gray-300 group-last:border-0 text-left"
                @click="navigateToPrayer(prayer)"
              >
                {{ prayer.title }}
              </button>
              <IconChevronRight class="ml-6" />
            </div>
          </div>
        </div>
      </RoundMain>
    </div>
  </BgWithHeader>
</template>
