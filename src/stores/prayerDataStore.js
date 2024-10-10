import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePrayerDataStore = defineStore('prayerData', () => {
  const prayers = ref({})
  const currentPrayer = ref(null)

  function loadPrayers(locale) {
    fetch(`/${locale}.json`)
      .then(response => response.json())
      .then(data => {
        this.prayers = data
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }

  function setCurrentPrayer(prayer) {
    this.currentPrayer = prayer
  }

  return { prayers, currentPrayer, loadPrayers, setCurrentPrayer }
})
