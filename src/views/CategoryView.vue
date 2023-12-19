<script setup>
import {RouterLink, useRoute} from 'vue-router';
import {computed, ref, watch} from "vue";
import IconMagnifyingGlass from "@/components/icons/IconMagnifyingGlass.vue";
import IconChevronRight from "@/components/icons/IconChevronRight.vue";
import BgWithHeader from "@/components/BgWithHeader.vue";
import RoundMain from "@/components/RoundMain.vue";
import {useI18n} from "vue-i18n";
import allPrayers from "@/prayers/all";
const { t, locale } = useI18n({ useScope: 'global' })


const route = useRoute();
const searchText = ref("")
const prayersInCategory = computed(
    () => allPrayers[locale.value]
        .filter((item) => item.category === route.params.name)
        .filter((item) => (clean(item.title).indexOf(clean(searchText.value)) >= 0))
        // sort by title by locale/language conventions
        .sort((a, b) => a.title.localeCompare(b.title, locale.value))
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
  <BgWithHeader :title="t(`category.${route.params.name}`)">
    <div class="flex flex-col">
      <div class="flex justify-center mb-6 mx-8">
        <div class="relative">
          <input type="text"
                 class="flex p-2 rounded-l-full rounded-r-full shadow-[0_0_15px_rgba(0,0,0,0.2)]
                  text-lg text-center placeholder:italic"
                 :placeholder="t('search')"
                 v-model="searchText"
                 @input="searchText = $event.target.value"
          />
          <IconMagnifyingGlass class="absolute top-[11px] left-[8px]"/>
        </div>
      </div>
      <RoundMain>
        <div class="-my-4">
          <div v-for="prayer in prayersInCategory" :key="prayer.id"
               class="group flex items-center text-xl">
            <RouterLink :to="{name: 'prayer', params: {id: prayer.id}}"
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
