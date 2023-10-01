<script setup>
import prayers from '../prayers.js'
import {RouterLink, useRoute} from 'vue-router';
import {computed, ref, watch} from "vue";

const route = useRoute();
const searchText = ref("")
const prayersInCategory = computed(
    () => prayers
        .filter((item) => item.category === route.params.name)
        .filter((item) => (clean(item.title).indexOf(clean(searchText.value)) >= 0))
        // sort by title by locale/language conventions
        .sort((a, b) => a.title.localeCompare(b.title))
)

function clean(value) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase()
}

watch(
    () => route.params.name,
    async () => {
      searchText.value = ""
    }
)
</script>

<template>
  <div class="about">
    <input type="text" class="block w-full mb-3 py-2 px-3 border-2"
           placeholder="Hľadať..."
           v-model="searchText"
           @input="searchText = $event.target.value"
    />
    <div v-for="prayer in prayersInCategory" :key="prayer.id" class="text-lg mb-3">
      <RouterLink :to="{name: 'prayer', params: {id: prayer.id}}" class="block rounded py-2 px-3 bg-orange-200">
        {{ prayer.title }}
      </RouterLink>
    </div>
  </div>
</template>
