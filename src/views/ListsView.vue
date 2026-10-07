<script setup>
import {computed, onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import BgWithHeader from "@/components/BgWithHeader.vue";
import RoundMain from "@/components/RoundMain.vue";
import IconChevronRight from "@/components/icons/IconChevronRight.vue";
import {BOOKMARKS_LIST_ID, usePrayerDataStore} from "@/stores/prayerDataStore";
import router from "@/router";

const {t} = useI18n({useScope: "global"});
const prayerDataStore = usePrayerDataStore();
const isLoading = ref(true);
const newListName = ref("");

// The bookmarks have their own menu entry, so they are not repeated here
const userLists = computed(() => prayerDataStore.lists.filter(list => list.id !== BOOKMARKS_LIST_ID));

onMounted(async () => {
  await prayerDataStore.loadUserData();
  isLoading.value = false;
});

async function createList() {
  const listId = await prayerDataStore.createList(newListName.value.trim());
  newListName.value = "";
  // A new list is empty, so open it ready for adding prayers
  await router.push({name: "list", params: {listId}, state: {editing: true}});
}
</script>

<template>
  <BgWithHeader :title="t('list.title')">
    <RoundMain>
      <div class="-my-4 flex flex-col">
        <div
          v-if="!isLoading && userLists.length === 0"
          class="text-center text-xl py-5 italic"
        >
          {{ t('list.noLists') }}
        </div>
        <div
          v-for="list in userLists"
          :key="list.id"
          class="flex items-center text-xl border-b border-gray-300"
        >
          <button
            class="py-5 grow text-left"
            @click="router.push({name: 'list', params: {listId: list.id}})"
          >
            {{ list.name }}
          </button>
          <IconChevronRight class="ml-6" />
        </div>

        <form
          class="flex flex-col items-center my-4 space-y-4"
          @submit.prevent="createList()"
        >
          <input
            v-model="newListName"
            type="text"
            :placeholder="t('list.namePlaceholder')"
            :aria-label="t('list.namePlaceholder')"
            class="w-full p-3 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.2)]
                   text-lg placeholder:italic bg-white dark:bg-neutral-600 dark:text-gray-300"
          >
          <button
            type="submit"
            :disabled="!newListName.trim()"
            class="py-2 px-12 rounded-l-full rounded-r-full bg-sky-500 dark:bg-sky-700 text-xl text-white
                   disabled:opacity-50"
          >
            {{ t('list.new') }}
          </button>
        </form>
      </div>
    </RoundMain>
  </BgWithHeader>
</template>
