<script setup>
import {computed, ref} from "vue";
import {LanguageNames} from "@/constants";
import IconCheck from "@/components/icons/IconCheck.vue";

// translations: {"en": "Our Father", "la": "Pater Noster"}, current: the shown language
const props = defineProps({
  title: {type: String, required: true},
  translations: {type: Object, required: true},
  current: {type: String, required: true}
});
const emit = defineEmits(["select"]);
const dialog = ref();

// Alphabetically by the language names
const languages = computed(() => Object.keys(props.translations)
  .sort((a, b) => (LanguageNames[a] ?? a).localeCompare(LanguageNames[b] ?? b)));

function open() {
  dialog.value.showModal();
}

function close() {
  dialog.value.close();
}

function select(lang) {
  close();
  if (lang !== props.current) {
    emit("select", lang);
  }
}

// A click on the dialog itself, not on its content, is a click on the backdrop
function closeOnBackdrop(event) {
  if (event.target === dialog.value) {
    close();
  }
}

defineExpose({open});
</script>

<template>
  <dialog
    ref="dialog"
    :aria-label="title"
    class="w-full max-w-none max-h-[85vh] overflow-y-auto mt-auto mb-0 mx-0 px-safe pb-[env(safe-area-inset-bottom)] rounded-t-2xl
           bg-neutral-100 text-[inherit] dark:bg-neutral-800 dark:text-gray-300 backdrop:bg-black/40"
    @click="closeOnBackdrop"
  >
    <div class="py-3">
      <h2 class="px-6 py-2 text-lg font-bold text-center">
        {{ title }}
      </h2>
      <ul>
        <li
          v-for="lang in languages"
          :key="lang"
        >
          <button
            :aria-current="lang === current"
            class="flex items-center w-full gap-4 px-6 py-3 text-left active:bg-sky-500/10"
            @click="select(lang)"
          >
            <span class="w-28 shrink-0 font-bold">{{ LanguageNames[lang] ?? lang }}</span>
            <span class="grow">{{ translations[lang] }}</span>
            <IconCheck
              class="shrink-0 text-sky-600 dark:text-sky-400"
              :class="{invisible: lang !== current}"
            />
          </button>
        </li>
      </ul>
    </div>
  </dialog>
</template>
