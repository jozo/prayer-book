import { ref } from 'vue'
import { defineStore } from 'pinia'
import {Preferences} from "@capacitor/preferences";

export const usePrayerDataStore = defineStore('prayerData', () => {
  const prayers = ref({})
  const currentPrayer = ref(null)

  async function loadPrayers(locale) {
    const response = await fetch(`/${locale}.json`)
    if (!response.ok) {
      console.error('Error:', response)
      return
    }

    const data = await response.json()
    data.custom = await loadCustomPrayers()
    prayers.value = data
  }

  async function loadCustomPrayers() {
    let customPrayers = await Preferences.get({key: 'customPrayers'})

    if (customPrayers.value === null) {
      return []
    } else {
      return JSON.parse(customPrayers.value)
    }
  }

  async function saveCustomPrayers() {
    await Preferences.set({key: 'customPrayers', value: JSON.stringify(prayers.value.custom)})
  }

  function setCurrentPrayer(prayer) {
    this.currentPrayer = prayer
  }

  return { prayers, currentPrayer, loadPrayers, saveCustomPrayers, setCurrentPrayer }
})
