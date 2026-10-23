import {Preferences} from "@capacitor/preferences";
import {Capacitor} from "@capacitor/core";
import {Directory, Encoding, Filesystem} from "@capacitor/filesystem";
import {Share} from "@capacitor/share";
import {Lang, PrayerFontScales} from "@/constants";
import {Device} from "@capacitor/device";

export async function getLanguage() {
  const availableLanguages = Object.values(Lang);

  let language = await Preferences.get({key: "language"});
  if (language.value && availableLanguages.includes(language.value)) {
    return language.value;
  }

  language = await Device.getLanguageCode();
  if (language.value && availableLanguages.includes(language.value)) {
    return language.value;
  }

  return "en";
}

export async function changeLanguage(language) {
  await Preferences.set({key: "language", value: language});
}

// The prayer text size is a CSS variable on the root element, read by .prayer-content
export async function loadPrayerFontScale() {
  const {value} = await Preferences.get({key: "prayerFontScale"});
  const scale = Number(value);
  applyPrayerFontScale(PrayerFontScales.includes(scale) ? scale : 1);
}

export function getPrayerFontScale() {
  return Number(document.documentElement.style.getPropertyValue("--prayer-font-scale")) || 1;
}

export async function changePrayerFontScale(scale) {
  applyPrayerFontScale(scale);
  await Preferences.set({key: "prayerFontScale", value: String(scale)});
}

function applyPrayerFontScale(scale) {
  document.documentElement.style.setProperty("--prayer-font-scale", String(scale));
}

// Lowercase without diacritics, so a search for "otcenas" finds "Otčenáš"
export function normalizeForSearch(value, locale) {
  return value.normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase(locale);
}

// Save a file the user picks a place for. The Android WebView can't download files, so there the
// file is written to the app's cache and handed to the share sheet, which offers saving it to
// Files or Drive or sending it.
export async function saveFile(fileName, text) {
  if (!Capacitor.isNativePlatform()) {
    const url = URL.createObjectURL(new Blob([text], {type: "application/json"}));
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    return;
  }

  const {uri} = await Filesystem.writeFile({
    path: fileName,
    data: text,
    directory: Directory.Cache,
    encoding: Encoding.UTF8
  });
  try {
    await Share.share({files: [uri]});
  } catch (error) {
    // Closing the share sheet without picking an app is not an error
    if (!/cancel/i.test(error?.message ?? "")) {
      throw error;
    }
  }
}
