<script setup>
import BgWithHeader from "@/components/BgWithHeader.vue";
import RoundMain from "@/components/RoundMain.vue";
import IconLightBulb from "@/components/icons/IconLightBulb.vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n({useScope: "global"});
</script>

<template>
  <BgWithHeader :title="t('menu.feedback')">
    <RoundMain>
      <div class="text-base text-center">
        <p class="mb-8">
          {{ t("feedback.intro") }}
        </p>

        <div
          class="flex flex-col items-center mb-8 px-4 pt-4 pb-5 rounded-xl border-2 border-sky-500 bg-sky-50
                 dark:border-sky-700 dark:bg-sky-950"
        >
          <span
            class="mb-2 py-0.5 px-3 rounded-full bg-sky-500 dark:bg-sky-700 text-xs font-bold uppercase
                   tracking-wide text-white"
          >
            {{ t("feedback.votu.recommended") }}
          </span>
          <h2 class="mb-2 text-xl font-bold">
            {{ t("feedback.votu.title") }}
          </h2>
          <p class="mb-4">
            {{ t("feedback.votu.description") }}
          </p>
          <a
            href="https://votu.dev/b/prayer-book/"
            rel="noopener"
            target="_blank"
            class="flex items-center py-3 px-10 rounded-l-full rounded-r-full bg-sky-500 dark:bg-sky-700
                   text-xl font-bold text-white shadow-[0_0_15px_rgba(0,0,0,0.2)]"
          >
            <IconLightBulb class="mr-2" />
            {{ t("feedback.votu.button") }}
          </a>
        </div>

        <div class="flex flex-col items-center">
          <h2 class="mb-2 text-xl font-bold">
            {{ t("feedback.email.title") }}
          </h2>
          <p class="mb-4">
            {{ t("feedback.email.description") }}
          </p>
          <a
            href="mailto:hi@jozo.io"
            class="py-2 px-10 rounded-l-full rounded-r-full border-2 border-sky-500 text-lg text-sky-600
                   dark:border-sky-700 dark:text-sky-400"
          >
            hi@jozo.io
          </a>
        </div>

        <div class="flex flex-col items-center mt-8">
          <h2 class="mb-2 text-xl font-bold">
            {{ t("feedback.matrix.title") }}
          </h2>
          <p class="mb-4">
            {{ t("feedback.matrix.description") }}
          </p>
          <a
            href="https://matrix.to/#/#prayer-book:matrix.org"
            rel="noopener"
            target="_blank"
            class="py-2 px-10 rounded-l-full rounded-r-full border-2 border-sky-500 text-lg text-sky-600
                   dark:border-sky-700 dark:text-sky-400"
          >
            #prayer-book:matrix.org
          </a>
        </div>
      </div>
    </RoundMain>
  </BgWithHeader>
</template>
