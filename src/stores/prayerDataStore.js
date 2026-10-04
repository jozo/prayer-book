import {ref} from "vue";
import {defineStore} from "pinia";
import {Preferences} from "@capacitor/preferences";

export const usePrayerDataStore = defineStore("prayerData", () => {
  // Structure of the allPrayers object:
  // {"en": {"prayers": {}, "categories": {}},
  //  "es": {"prayers": {}, "categories": {}},
  //  "bookmarks": {"en": {"angelus": true}, "custom": {"custom-0": true}},
  //  "custom": {}}
  // Only languages that were requested are present. A language is fetched once, when it is
  // first needed: the current language by the views, other languages only by the bookmarks list
  // or when a bookmarked prayer from that language is opened.
  const allPrayers = ref({"custom": {}, "bookmarks": {}});

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

  // Bookmarks and custom prayers are stored on the device and are needed by most views.
  // Saving either before it is loaded would overwrite everything stored.
  function loadUserData() {
    return loadOnce("userData", () => Promise.all([loadBookmarks(), loadCustomPrayers()]));
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

  async function loadBookmarkedPrayers() {
    await loadUserData();
    const languages = Object.keys(allPrayers.value.bookmarks).filter(lang => lang !== "custom");
    await Promise.all(languages.map(loadLanguage));
  }

  async function loadBookmarks() {
    const bookmarksJson = await Preferences.get({key: "bookmarks"});
    if (bookmarksJson.value) {
      allPrayers.value.bookmarks = JSON.parse(bookmarksJson.value);
    }
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

  function isBookmarked(lang, prayerId) {
    return allPrayers.value.bookmarks[lang]?.[prayerId] !== undefined;
  }

  async function toggleBookmark(lang, prayerId) {
    await loadUserData();
    const bookmarks = allPrayers.value.bookmarks;

    if (isBookmarked(lang, prayerId)) {
      delete bookmarks[lang][prayerId];
      if (Object.keys(bookmarks[lang]).length === 0) {
        // An empty language would still be fetched for the bookmarks list
        delete bookmarks[lang];
      }
    } else {
      bookmarks[lang] ??= {};
      bookmarks[lang][prayerId] = true;
    }

    await Preferences.set({key: "bookmarks", value: JSON.stringify(bookmarks)});
  }

  async function saveCustomPrayers() {
    await Preferences.set({key: "customPrayers", value: JSON.stringify(allPrayers.value.custom)});
  }

  return {
    allPrayers,
    loadUserData,
    loadLanguage,
    loadPrayers,
    loadPrayer,
    loadBookmarkedPrayers,
    isBookmarked,
    toggleBookmark,
    saveCustomPrayers
  };
});
