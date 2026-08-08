import "./assets/main.css";

import {SplashScreen} from "@capacitor/splash-screen";

SplashScreen.hide();

import {createApp} from "vue";
import {createI18n} from "vue-i18n";
import {createPinia} from "pinia";

import App from "./App.vue";
import router from "./router";
import messages from "@/messages";
import {getLanguage} from "@/utils";

const app = createApp(App);

const i18n = createI18n({
  legacy: false,
  mode: "composition",
  locale: await getLanguage(),
  fallbackLocale: "en",
  messages
});

app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount("#app");
