<script setup>
import {computed, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {useI18n} from "vue-i18n";
import {VueDraggable} from "vue-draggable-plus";
import BgWithHeader from "@/components/BgWithHeader.vue";
import RoundMain from "@/components/RoundMain.vue";
import IconBars3 from "@/components/icons/IconBars3.vue";
import IconChevronRight from "@/components/icons/IconChevronRight.vue";
import IconPlus from "@/components/icons/IconPlus.vue";
import IconXMark from "@/components/icons/IconXMark.vue";
import {BOOKMARKS_LIST_ID, usePrayerDataStore} from "@/stores/prayerDataStore";
import router from "@/router";

const {t} = useI18n({useScope: "global"});
const route = useRoute();
const prayerDataStore = usePrayerDataStore();

const listId = computed(() => route.params.listId);
const isBookmarks = computed(() => listId.value === BOOKMARKS_LIST_ID);
const list = computed(() => prayerDataStore.getList(listId.value));
const title = computed(() => isBookmarks.value ? t("category.bookmarks") : list.value?.name ?? "");
const isLoading = ref(true);
// Kept in the history entry, so the list is still in edit mode when coming back from adding prayers
const isEditing = ref(false);
const listName = ref("");

// The draggable list reorders this copy right away, the store follows in moveItem()
const items = ref([]);
watch(() => prayerDataStore.resolveListItems(listId.value), (resolved) => {
  items.value = resolved;
}, {immediate: true});

// The view stays mounted when navigating between lists, e.g. from the menu
watch(listId, async () => {
  isLoading.value = true;
  isEditing.value = history.state?.editing === true;
  await prayerDataStore.loadListPrayers(listId.value);
  if (!list.value) {
    // The list was deleted or the URL is wrong
    await router.replace({name: "lists"});
    return;
  }
  listName.value = list.value.name ?? "";
  isLoading.value = false;
}, {immediate: true});

function setEditing(value) {
  isEditing.value = value;
  history.replaceState({...history.state, editing: value}, "");
}

async function saveName() {
  const name = listName.value.trim();
  if (name && name !== list.value.name) {
    await prayerDataStore.renameList(listId.value, name);
  }
  listName.value = list.value.name;
}

async function moveItem({oldIndex, newIndex}) {
  // Work out the move from the store's order, which the drag has not changed
  const shown = prayerDataStore.resolveListItems(listId.value);
  const moved = shown[oldIndex];
  const rest = shown.filter(item => item.id !== moved.id);
  await prayerDataStore.moveInList(listId.value, moved.id, rest[newIndex]?.id);
}

async function deleteList() {
  if (confirm(t("list.confirmDelete"))) {
    await prayerDataStore.deleteList(listId.value);
    await router.replace({name: "lists"});
  }
}

function navigateToPrayer(item) {
  router.push({name: "view-prayer", params: {lang: item.lang, prayerId: item.prayerId}});
}
</script>

<template>
  <BgWithHeader :title="title">
    <RoundMain>
      <div
        v-if="!isLoading"
        class="-my-4 flex flex-col"
      >
        <template v-if="isEditing">
          <input
            v-if="!isBookmarks"
            v-model="listName"
            type="text"
            :placeholder="t('list.namePlaceholder')"
            :aria-label="t('list.namePlaceholder')"
            class="w-full mt-4 p-3 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.2)]
                   text-lg placeholder:italic bg-white dark:bg-neutral-600 dark:text-gray-300"
            @change="saveName()"
            @keydown.enter="$event.target.blur()"
          >
          <button
            class="flex items-center justify-center mt-4 py-2 px-12 rounded-l-full rounded-r-full
                   bg-sky-500 dark:bg-sky-700 text-xl text-white"
            @click="router.push({name: 'list-add', params: {listId}})"
          >
            <IconPlus class="mr-2" />
            {{ t('list.addPrayers') }}
          </button>
        </template>

        <div
          v-if="items.length === 0"
          class="text-center text-xl py-5 italic"
        >
          {{ t('list.empty') }}
        </div>

        <VueDraggable
          v-else-if="isEditing"
          v-model="items"
          handle=".drag-handle"
          :animation="150"
          @update="moveItem"
        >
          <div
            v-for="item in items"
            :key="item.id"
            class="group flex items-center text-xl bg-neutral-100 dark:bg-neutral-800"
          >
            <!-- touch-none lets the handle start a drag instead of scrolling the page -->
            <span
              class="drag-handle -ml-2 p-2 cursor-grab touch-none text-gray-500 dark:text-neutral-400"
              :aria-label="t('list.drag')"
            >
              <IconBars3 />
            </span>
            <span class="py-5 grow ml-2 border-b border-gray-300 group-last:border-0">
              {{ item.title }}
            </span>
            <button
              class="-mr-2 p-2 text-red-500"
              :aria-label="t('list.remove')"
              @click="prayerDataStore.removeFromList(listId, item.id)"
            >
              <IconXMark />
            </button>
          </div>
        </VueDraggable>

        <div v-else>
          <div
            v-for="item in items"
            :key="item.id"
            class="group flex items-center text-xl"
          >
            <button
              class="py-5 grow border-b border-gray-300 group-last:border-0 text-left"
              @click="navigateToPrayer(item)"
            >
              {{ item.title }}
            </button>
            <IconChevronRight class="ml-6" />
          </div>
        </div>

        <div class="flex flex-wrap justify-center gap-4 my-4">
          <button
            class="py-2 px-10 rounded-l-full rounded-r-full bg-sky-500 dark:bg-sky-700 text-lg text-white"
            @click="setEditing(!isEditing)"
          >
            {{ isEditing ? t('list.done') : t('list.edit') }}
          </button>
          <button
            v-if="isEditing && !isBookmarks"
            class="py-2 px-10 rounded-l-full rounded-r-full bg-red-500 dark:bg-red-800 text-lg text-white"
            @click="deleteList()"
          >
            {{ t('list.delete') }}
          </button>
        </div>
      </div>
    </RoundMain>
  </BgWithHeader>
</template>
