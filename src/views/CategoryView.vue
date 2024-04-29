<script setup>
import {RouterLink, useRoute} from 'vue-router';
import {computed, ref, watch} from "vue";
import IconMagnifyingGlass from "@/components/icons/IconMagnifyingGlass.vue";
import IconChevronRight from "@/components/icons/IconChevronRight.vue";
import BgWithHeader from "@/components/BgWithHeader.vue";
import RoundMain from "@/components/RoundMain.vue";
import {useI18n} from "vue-i18n";
import {prayers} from "@/prayers/db";
import {Categories, Category} from "@/constants";

const {t, locale} = useI18n({useScope: 'global'})


const route = useRoute();
const searchText = ref("")
const category = computed(() => {
  switch (route.params.categoryName) {
    case "basic":
      return Category.Basic
    case "rosary":
      return Category.Rosary
    case "litany":
      return Category.Litany
    case "saints":
      return Category.Saints
    default:
      console.error("Unknown category: " + route.params.categoryName)
      return Category.All
  }
})

const prayersInCategory = computed(
    () => {
      let selectedPrayers = []

      if (category.value === Category.All) {
        for (const [prayerId, prayer] of Object.entries(prayers[locale.value])) {
          selectedPrayers.push(
              {prayerId: prayerId, title: prayer[0].title}
          )
        }
      } else {
        for (const prayerId of Categories[category.value]) {
          if (prayerId in prayers[locale.value]) {
            selectedPrayers.push(
                {prayerId: prayerId, title: prayers[locale.value][prayerId][0].title}
            )
          }
        }
      }

      if (searchText.value !== "") {
        selectedPrayers = selectedPrayers
            .filter((item) => (clean(item.title).indexOf(clean(searchText.value)) >= 0))
      }
      // sort by title by locale/language conventions
      return selectedPrayers
          .sort((a, b) => a.title.localeCompare(b.title, locale.value))
    }
)

function clean(value) {
  return value.normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLocaleLowerCase(locale.value)
}

watch(
    () => route.params.name,
    async () => {
      searchText.value = ""
    }
)
</script>

<template>
  <BgWithHeader :title="t(`category.${route.params.categoryName}`)">
    <div class="flex flex-col">
      <div class="flex justify-center mb-6 mx-8">
        <div class="relative">
          <input type="text"
                 class="flex p-2 rounded-l-full rounded-r-full shadow-[0_0_15px_rgba(0,0,0,0.2)]
                  text-lg text-center placeholder:italic"
                 autofocus
                 :placeholder="t('search')"
                 v-model="searchText"
                 @input="searchText = $event.target.value"
          />
          <IconMagnifyingGlass class="absolute top-[11px] left-[8px]"/>
        </div>
      </div>
      <RoundMain>
        <div class="-my-4">
          <div v-for="prayer in prayersInCategory" :key="prayer.prayerId"
               class="group flex items-center text-xl">
            <RouterLink :to="{name: 'prayer', params: {id: prayer.prayerId}}"
                        class="py-5 grow border-b border-gray-300 group-last:border-0">
              {{ prayer.title }}
            </RouterLink>
            <IconChevronRight class="ml-6"/>
          </div>
        </div>
      </RoundMain>
    </div>
  </BgWithHeader>
</template>
