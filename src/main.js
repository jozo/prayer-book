import "./assets/main.css";

import {SplashScreen} from "@capacitor/splash-screen";

import {createApp, watch} from "vue";
import {createI18n} from "vue-i18n";
import {createPinia} from "pinia";

import App from "./App.vue";
import router from "./router";
import messages from "@/messages";
import {getLanguage, loadPrayerFontScale} from "@/utils";
import {usePrayerDataStore} from "@/stores/prayerDataStore";

const app = createApp(App);

const [language] = await Promise.all([getLanguage(), loadPrayerFontScale()]);

const i18n = createI18n({
  legacy: false,
  mode: "composition",
  locale: language,
  fallbackLocale: "en",
  messages
});

app.use(createPinia());
app.use(router);
app.use(i18n);

// Start loading prayers of the current language now, in parallel with the route's code, instead
// of after the view is loaded. Other languages are loaded only when they are needed.
usePrayerDataStore().loadPrayers(i18n.global.locale.value);

// Screen readers use the page language for pronunciation
watch(i18n.global.locale, (locale) => {
  document.documentElement.lang = locale;
}, {immediate: true});

app.mount("#app");

SplashScreen.hide();
