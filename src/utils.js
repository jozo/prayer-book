import {Preferences} from "@capacitor/preferences";
import {Lang} from "@/constants";
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
