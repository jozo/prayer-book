import {ref} from "vue";
import {defineStore} from "pinia";
import {Preferences} from "@capacitor/preferences";

export const BOOKMARKS_LIST_ID = "bookmarks";

// How many recently opened prayers the home screen shows
const RECENT_PRAYERS_LIMIT = 5;

// Identifies a backup file, the version changes when its format does
const BACKUP_APP = "prayer-book";
const BACKUP_VERSION = 1;

export class InvalidBackupError extends Error {}

// Unique enough for lists and list items, which are created one at a time on one device
let idCounter = 0;
function newId(prefix) {
  return `${prefix}-${Date.now().toString(36)}${(idCounter++).toString(36)}`;
}

export const usePrayerDataStore = defineStore("prayerData", () => {
  // Structure of the allPrayers object:
  // {"en": {"prayers": {}, "categories": {}},
  //  "es": {"prayers": {}, "categories": {}},
  //  "custom": {}}
  // Only languages that were requested are present. A language is fetched once, when it is
  // first needed: the current language by the views, other languages only by a list
  // or when a prayer from that language is opened.
  const allPrayers = ref({"custom": {}});

  // Ordered lists of prayers. The first one is always the bookmarks, which cannot be renamed or
  // deleted. Its name is null, the views show the translated "Bookmarks" instead.
  // [{id: "bookmarks", name: null, items: [{id: "item-...", lang: "en", prayerId: "ourFather"}]},
  //  {id: "list-...", name: "Prayer group", items: [...]}]
  // An item's lang can be "custom". The bookmarks hold each prayer once, other lists can repeat it.
  const lists = ref([newBookmarksList()]);

  // Recently opened prayers, the most recent first: [{lang: "en", prayerId: "ourFather"}].
  // Each prayer is there once, in the language it was last opened in.
  const recentPrayers = ref([]);

  // In-flight and finished loads by key, so concurrent callers share one request
  const loads = {};

  function loadOnce(key, loader) {
    if (!loads[key]) {
      loads[key] = loader().catch((error) => {
        // Forget the failed load so a later call can retry it
        delete loads[key];
        console.error(`Error loading "${key}":`, error);
      });
    }
    return loads[key];
  }

  // Lists and custom prayers are stored on the device and are needed by most views.
  // Saving either before it is loaded would overwrite everything stored.
  function loadUserData() {
    return loadOnce("userData", async () => {
      // Migrating the old bookmarks needs the titles of the custom prayers
      await loadCustomPrayers();
      await loadLists();
      await loadRecentPrayers();
    });
  }

  function loadLanguage(lang) {
    return loadOnce(`lang:${lang}`, async () => {
      const response = await fetch(`/${lang}.json`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      // A missing file can be answered with the SPA's index.html, which is not valid JSON.
      // response.json() then throws and the language stays unloaded.
      allPrayers.value[lang] = await response.json();
    });
  }

  async function loadPrayers(lang) {
    await Promise.all([loadUserData(), loadLanguage(lang)]);
  }

  async function loadPrayer(id, lang) {
    if (lang === "custom") {
      await loadUserData();
    } else {
      await loadPrayers(lang);
    }
  }

  // Load every language the list points to, a list can mix prayers of several languages
  async function loadListPrayers(listId) {
    await loadUserData();
    await loadItemLanguages(getList(listId)?.items ?? []);
  }

  async function loadItemLanguages(items) {
    const languages = new Set(items.map(item => item.lang).filter(lang => lang !== "custom"));
    await Promise.all([...languages].map(loadLanguage));
  }

  function newBookmarksList() {
    return {id: BOOKMARKS_LIST_ID, name: null, items: []};
  }

  async function loadLists() {
    const listsJson = await Preferences.get({key: "lists"});
    if (listsJson.value) {
      lists.value = JSON.parse(listsJson.value);
      return;
    }

    // Versions before lists stored the bookmarks as {"en": {"angelus": true}} under "bookmarks".
    // The old key is kept, so the data is not lost when the app is downgraded.
    const bookmarksJson = await Preferences.get({key: "bookmarks"});
    if (bookmarksJson.value) {
      await migrateBookmarks(JSON.parse(bookmarksJson.value));
    }
  }

  async function migrateBookmarks(bookmarks) {
    const items = [];
    for (const lang in bookmarks) {
      for (const prayerId in bookmarks[lang]) {
        items.push(newItem(lang, prayerId));
      }
    }
    // The bookmarks used to be shown sorted by title, keep that order for the users that had them
    await loadItemLanguages(items);
    const titled = items.map(item => ({item, title: findPrayer(item.lang, item.prayerId)?.title ?? ""}));
    titled.sort((a, b) => a.title.localeCompare(b.title));

    lists.value = [{...newBookmarksList(), items: titled.map(({item}) => item)}];
    await saveLists();
  }

  async function loadCustomPrayers() {
    const customPrayers = await Preferences.get({key: "customPrayers"});

    if (customPrayers.value !== null) {
      const parsed = JSON.parse(customPrayers.value);

      if (Array.isArray(parsed)) {
        // If the custom prayers are an array, convert them to an object
        // We do it to support the old format
        parsed.forEach((prayer, index) => {
          prayer.id = `custom-${index}`;
          prayer.lang = "custom";
          allPrayers.value.custom[prayer.id] = prayer;
        });
      } else {
        // If the custom prayers are an object, use them directly
        allPrayers.value.custom = parsed;
      }
    }
  }

  function findPrayer(lang, prayerId) {
    if (lang === "custom") {
      return allPrayers.value.custom[prayerId];
    }
    return allPrayers.value[lang]?.prayers?.[prayerId];
  }

  // Every prayer of the language and every custom prayer, as {id, title} with lang only on custom
  function getAllPrayers(lang) {
    // A prayer can be in several categories, keep it only once
    const prayers = {};
    for (const category in allPrayers.value[lang]?.categories) {
      for (const prayer of allPrayers.value[lang].categories[category]) {
        prayers[prayer.id] = prayer;
      }
    }
    return [...Object.values(prayers), ...Object.values(allPrayers.value.custom)];
  }

  function newItem(lang, prayerId) {
    return {id: newId("item"), lang, prayerId};
  }

  function getList(listId) {
    return lists.value.find(list => list.id === listId);
  }

  // The list's prayers in order, with their titles. Items whose prayer no longer exists, e.g.
  // removed or renamed in an app update, are left out but stay stored.
  function resolveListItems(listId) {
    const items = [];
    for (const item of getList(listId)?.items ?? []) {
      const prayer = findPrayer(item.lang, item.prayerId);
      if (prayer) {
        items.push({...item, title: prayer.title});
      }
    }
    return items;
  }

  async function loadRecentPrayers() {
    const recentJson = await Preferences.get({key: "recentPrayers"});
    if (recentJson.value) {
      recentPrayers.value = JSON.parse(recentJson.value);
    }
  }

  async function saveRecentPrayers() {
    await Preferences.set({key: "recentPrayers", value: JSON.stringify(recentPrayers.value)});
  }

  // Translations share the prayer ID and custom IDs differ from built-in ones, so the ID alone
  // identifies the prayer. Switching the translation updates its entry instead of adding one.
  async function recordVisit(lang, prayerId) {
    await loadUserData();
    const others = recentPrayers.value.filter(recent => recent.prayerId !== prayerId);
    recentPrayers.value = [{lang, prayerId}, ...others].slice(0, RECENT_PRAYERS_LIMIT);
    await saveRecentPrayers();
  }

  // Load every language the recent prayers are in, they can be in several
  async function loadRecentPrayerLanguages() {
    await loadUserData();
    await loadItemLanguages(recentPrayers.value);
  }

  // The recent prayers with their titles, without those that no longer exist
  function resolveRecentPrayers() {
    return recentPrayers.value
      .map(recent => ({...recent, title: findPrayer(recent.lang, recent.prayerId)?.title}))
      .filter(recent => recent.title);
  }

  async function clearRecentPrayers() {
    await loadUserData();
    recentPrayers.value = [];
    await saveRecentPrayers();
  }

  async function saveLists() {
    await Preferences.set({key: "lists", value: JSON.stringify(lists.value)});
  }

  function countInList(listId, lang, prayerId) {
    return getList(listId)?.items.filter(item => item.lang === lang && item.prayerId === prayerId).length ?? 0;
  }

  function isBookmarked(lang, prayerId) {
    return countInList(BOOKMARKS_LIST_ID, lang, prayerId) > 0;
  }

  async function toggleBookmark(lang, prayerId) {
    await loadUserData();
    const bookmarks = getList(BOOKMARKS_LIST_ID);

    if (isBookmarked(lang, prayerId)) {
      bookmarks.items = bookmarks.items.filter(item => item.lang !== lang || item.prayerId !== prayerId);
    } else {
      bookmarks.items.push(newItem(lang, prayerId));
    }

    await saveLists();
  }

  async function createList(name) {
    await loadUserData();
    const list = {id: newId("list"), name, items: []};
    lists.value.push(list);
    await saveLists();
    return list.id;
  }

  async function renameList(listId, name) {
    const list = getList(listId);
    if (listId === BOOKMARKS_LIST_ID || !list) {
      return;
    }
    list.name = name;
    await saveLists();
  }

  async function deleteList(listId) {
    if (listId === BOOKMARKS_LIST_ID) {
      return;
    }
    lists.value = lists.value.filter(list => list.id !== listId);
    await saveLists();
  }

  async function addToList(listId, lang, prayerId) {
    if (listId === BOOKMARKS_LIST_ID && isBookmarked(lang, prayerId)) {
      return;
    }
    getList(listId).items.push(newItem(lang, prayerId));
    await saveLists();
  }

  async function removeFromList(listId, itemId) {
    const list = getList(listId);
    list.items = list.items.filter(item => item.id !== itemId);
    await saveLists();
  }

  // Indexes are positions among the shown items, which leave out prayers that no longer exist.
  // Moving by item IDs keeps those hidden items where they are.
  async function moveInList(listId, itemId, beforeItemId) {
    const list = getList(listId);
    const item = list.items.find(i => i.id === itemId);
    const items = list.items.filter(i => i.id !== itemId);
    const index = beforeItemId ? items.findIndex(i => i.id === beforeItemId) : items.length;
    items.splice(index, 0, item);
    list.items = items;
    await saveLists();
  }

  // Used when a custom prayer is deleted, also forgets it was opened recently
  async function removePrayerFromLists(lang, prayerId) {
    await loadUserData();
    for (const list of lists.value) {
      list.items = list.items.filter(item => item.lang !== lang || item.prayerId !== prayerId);
    }
    recentPrayers.value = recentPrayers.value.filter(recent => recent.lang !== lang || recent.prayerId !== prayerId);
    await saveLists();
    await saveRecentPrayers();
  }

  async function saveCustomPrayers() {
    await Preferences.set({key: "customPrayers", value: JSON.stringify(allPrayers.value.custom)});
  }

  // Custom prayers and lists in the format the backup file stores. The recent prayers are history,
  // not something the user made, so they are left out.
  async function exportUserData() {
    await loadUserData();
    return {
      app: BACKUP_APP,
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      customPrayers: allPrayers.value.custom,
      lists: lists.value
    };
  }

  // Adds a backup to the existing data, nothing is overwritten. Prayers and lists that are already
  // here are skipped, so importing the same backup twice does not duplicate them.
  // Throws InvalidBackupError when the data is not a backup.
  async function importUserData(data) {
    if (data?.app !== BACKUP_APP || typeof data.customPrayers !== "object" || !Array.isArray(data.lists)) {
      throw new InvalidBackupError();
    }
    await loadUserData();
    const imported = {prayers: 0, lists: 0, bookmarks: 0};

    // Imported prayers get new IDs, the backup's IDs can be taken by other prayers here
    const prayerIds = {};
    for (const [oldId, prayer] of Object.entries(data.customPrayers ?? {})) {
      const content = prayer?.versions?.[0]?.content;
      if (typeof prayer?.title !== "string" || typeof content !== "string") {
        continue;
      }
      const existing = Object.values(allPrayers.value.custom)
        .find(p => p.title === prayer.title && p.versions[0].content === content);
      if (existing) {
        prayerIds[oldId] = existing.id;
        continue;
      }
      const id = nextCustomPrayerId();
      allPrayers.value.custom[id] = {id, title: prayer.title, categories: ["custom"], versions: [{name: "", content}], lang: "custom"};
      prayerIds[oldId] = id;
      imported.prayers++;
    }

    for (const list of data.lists) {
      const items = importListItems(list?.items, prayerIds);
      if (list?.id === BOOKMARKS_LIST_ID) {
        for (const item of items) {
          if (!isBookmarked(item.lang, item.prayerId)) {
            getList(BOOKMARKS_LIST_ID).items.push(item);
            imported.bookmarks++;
          }
        }
      } else if (typeof list?.name === "string" && !hasSameList(list.name, items)) {
        lists.value.push({id: newId("list"), name: list.name, items});
        imported.lists++;
      }
    }

    await saveCustomPrayers();
    await saveLists();
    return imported;
  }

  // New items of a list from a backup. Items of custom prayers missing from the backup are left out.
  function importListItems(items, prayerIds) {
    const result = [];
    for (const item of Array.isArray(items) ? items : []) {
      if (typeof item?.lang !== "string" || typeof item.prayerId !== "string") {
        continue;
      }
      const prayerId = item.lang === "custom" ? prayerIds[item.prayerId] : item.prayerId;
      if (prayerId) {
        result.push(newItem(item.lang, prayerId));
      }
    }
    return result;
  }

  function hasSameList(name, items) {
    const key = list => list.map(item => `${item.lang}/${item.prayerId}`).join("\n");
    return lists.value.some(list => list.id !== BOOKMARKS_LIST_ID && list.name === name && key(list.items) === key(items));
  }

  // One more than the highest existing number
  function nextCustomPrayerId() {
    const usedIds = Object.keys(allPrayers.value.custom)
      .map(id => parseInt(id.replace("custom-", ""), 10))
      .filter(id => !isNaN(id));
    return `custom-${usedIds.length ? Math.max(...usedIds) + 1 : 0}`;
  }

  return {
    allPrayers,
    lists,
    recentPrayers,
    loadUserData,
    loadLanguage,
    loadPrayers,
    loadPrayer,
    loadListPrayers,
    getAllPrayers,
    getList,
    resolveListItems,
    countInList,
    isBookmarked,
    toggleBookmark,
    createList,
    renameList,
    deleteList,
    addToList,
    removeFromList,
    moveInList,
    removePrayerFromLists,
    recordVisit,
    loadRecentPrayerLanguages,
    resolveRecentPrayers,
    clearRecentPrayers,
    saveCustomPrayers,
    nextCustomPrayerId,
    exportUserData,
    importUserData
  };
});
