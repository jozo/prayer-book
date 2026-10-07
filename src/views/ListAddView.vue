<script setup>
import {computed, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {useI18n} from "vue-i18n";
import BgWithHeader from "@/components/BgWithHeader.vue";
import RoundMain from "@/components/RoundMain.vue";
import IconCheck from "@/components/icons/IconCheck.vue";
import IconMagnifyingGlass from "@/components/icons/IconMagnifyingGlass.vue";
import {BOOKMARKS_LIST_ID, usePrayerDataStore} from "@/stores/prayerDataStore";
import router from "@/router";
import {normalizeForSearch} from "@/utils";

const {t, locale} = useI18n({useScope: "global"});
const lang = locale.value;
const route = useRoute();
const prayerDataStore = usePrayerDataStore();

const listId = route.params.listId;
const isBookmarks = listId === BOOKMARKS_LIST_ID;
const searchText = ref("");
const isLoading = ref(true);

const prayers = computed(() => {
  let prayers = prayerDataStore.getAllPrayers(lang).map(prayer => ({...prayer, lang: prayer.lang || lang}));

  if (searchText.value !== "") {
    const search = normalizeForSearch(searchText.value, locale.value);
    prayers = prayers.filter(prayer => normalizeForSearch(prayer.title, locale.value).includes(search));
  }
  return prayers.sort((a, b) => a.title.localeCompare(b.title, locale.value));
});

onMounted(async () => {
  await prayerDataStore.loadPrayers(lang);
  if (!prayerDataStore.getList(listId)) {
    await router.replace({name: "lists"});
    return;
  }
  isLoading.value = false;
});

function countInList(prayer) {
  return prayerDataStore.countInList(listId, prayer.lang, prayer.id);
}

async function selectPrayer(prayer) {
  // A prayer is bookmarked only once, so tapping a bookmarked one removes it again.
  // Other lists can hold a prayer several times, e.g. a Glory Be after each part of a prayer meeting.
  if (isBookmarks) {
    await prayerDataStore.toggleBookmark(prayer.lang, prayer.id);
  } else {
    await prayerDataStore.addToList(listId, prayer.lang, prayer.id);
  }
}

function done() {
  // Go back to the list in edit mode, unless this page was opened directly
  if (history.state?.back) {
    router.back();
  } else {
    router.replace({name: "list", params: {listId}, state: {editing: true}});
  }
}
</script>

<template>
  <BgWithHeader :title="t('list.addPrayers')">
    <div class="flex flex-col">
      <div class="flex justify-center content-center mb-6 mx-8">
        <div class="relative">
          <input
            v-model="searchText"
            type="text"
            class="flex p-2 rounded-l-full rounded-r-full shadow-[0_0_15px_rgba(0,0,0,0.2)]
                  bg-white text-lg text-center text-gray-700 placeholder:italic placeholder:text-gray-500
                  outline-none focus:ring-2 focus:ring-white/80 dark:bg-neutral-700 dark:text-gray-100 dark:placeholder:text-neutral-400"
            :placeholder="t('search')"
          >
          <IconMagnifyingGlass class="absolute top-[11px] left-[8px] pointer-events-none text-gray-500 dark:text-neutral-400" />
        </div>
      </div>
      <RoundMain>
        <div class="-my-4 flex flex-col">
          <button
            class="flex justify-center mt-4 py-2 px-12 rounded-l-full rounded-r-full bg-sky-500 dark:bg-sky-700 text-xl text-white"
            @click="done()"
          >
            {{ t('list.done') }}
          </button>

          <div
            v-if="!isLoading && prayers.length === 0"
            class="text-center text-xl py-5 italic"
          >
            {{ t('prayer.notFound') }}
          </div>
          <div v-else>
            <button
              v-for="prayer in prayers"
              :key="`${prayer.lang}/${prayer.id}`"
              class="flex items-center w-full py-5 text-xl text-left border-b border-gray-300 last:border-0"
              @click="selectPrayer(prayer)"
            >
              <span class="grow">{{ prayer.title }}</span>
              <span
                v-if="countInList(prayer) > 0"
                class="flex items-center ml-4 text-sky-600 dark:text-sky-400"
              >
                <span
                  v-if="countInList(prayer) > 1"
                  class="mr-1 text-base"
                >{{ countInList(prayer) }}×</span>
                <IconCheck />
              </span>
            </button>
          </div>
        </div>
      </RoundMain>
    </div>
  </BgWithHeader>
</template>
