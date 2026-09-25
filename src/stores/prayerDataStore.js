import {ref} from "vue";
import {defineStore} from "pinia";
import {Preferences} from "@capacitor/preferences";
import {isEmpty} from "@/utils";

export const usePrayerDataStore = defineStore("prayerData", () => {
  // Structure of the allPrayers object:
  // {"en": {"prayers": {}, "categories": []},
  //  "es": {"prayers": {}, "categories": []},
  //  "bookmarks": {"en": ["angelus": true], "custom": {"angelus": true}},
  //  "custom": {}}
  // }
  const allPrayers = ref({"custom": {}, "bookmarks": {}});

  async function loadPrayer(id, lang) {
    if (lang === "custom") {
      // Bookmarks are needed to show the bookmark state, and saving a bookmark before they are
      // loaded would overwrite all stored bookmarks.
      if (isEmpty(allPrayers.value.bookmarks)) {
        await loadBookmarks();
      }
      if (isEmpty(allPrayers.value.custom)) {
        await loadCustomPrayers();
      }
    } else if (allPrayers.value[lang] === undefined) {
      await loadPrayers(lang);
    }
  }

  async function loadPrayers(lang) {
    if (allPrayers.value[lang] !== undefined) {
      return;
    }

    if (isEmpty(allPrayers.value.bookmarks)) {
      await loadBookmarks();
    }
    if (isEmpty(allPrayers.value.custom)) {
      await loadCustomPrayers();
    }

    // We want to load prayers for the current language and all languages from bookmarks
    const languages = new Set(Object.keys(allPrayers.value.bookmarks).filter(lang => lang !== "custom"));
    languages.add(lang);

    for (const language of languages) {
      if (allPrayers.value[language] === undefined) {
        const response = await fetch(`/${language}.json`);
        if (!response.ok) {
          console.error("Error:", response);
          continue;
        }
        // A missing file can be answered with the SPA's index.html, which is not valid JSON.
        // Skip that language instead of failing to load the others.
        try {
          allPrayers.value[language] = await response.json();
        } catch (error) {
          console.error(`Error loading prayers for "${language}":`, error);
        }
      }
    }
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

  async function saveCustomPrayers() {
    await Preferences.set({key: "customPrayers", value: JSON.stringify(allPrayers.value.custom)});
  }

  return {saveCustomPrayers, loadPrayer, loadPrayers, loadCustomPrayers, allPrayers};
});
