<script setup>
import BgWithHeader from "@/components/BgWithHeader.vue";
import RoundMain from "@/components/RoundMain.vue";
import {useI18n} from "vue-i18n";

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <BgWithHeader :title="t('menu.settings')">
    <RoundMain>
      <div class="text-base text-center">
        <p>
          <strong>Prayer Book</strong>
        </p>
        <p>0.1.0</p>
        <p>hi@jozo.io</p>
        <p>
          <a href="https://codeberg.org/jozo/prayer-book" target="_blank"
             class="text-sky-600">
            codeberg.org/jozo/prayer-book
          </a>
        </p>
      </div>
    </RoundMain>
  </BgWithHeader>
</template>
