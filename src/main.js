import './assets/main.css'

import {SplashScreen} from "@capacitor/splash-screen";

SplashScreen.hide();

import {createApp} from 'vue'
import {createI18n} from 'vue-i18n'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router'
import messages from "@/messages";
import {Preferences} from "@capacitor/preferences";
import {usePrayerDataStore} from "@/stores/prayerDataStore";

const app = createApp(App)

const savedLanguage = await Preferences.get({key: 'language'})

const i18n = createI18n({
  legacy: false,
  mode: "composition",
  locale: savedLanguage.value || "en",
  fallbackLocale: 'en',
  messages,
})

app.use(createPinia())
app.use(router)
app.use(i18n)

const prayerDataStore = usePrayerDataStore()
await prayerDataStore.loadPrayers(savedLanguage.value || 'en')

app.mount('#app')
