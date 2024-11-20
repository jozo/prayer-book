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
        <p>0.5.0</p>
        <p>hi@jozo.io</p>
        <p class="mb-6">
          <a href="https://codeberg.org/jozo/prayer-book" target="_blank"
             class="text-sky-600">
            codeberg.org/jozo/prayer-book
          </a>
        </p>
        <p>
          <strong>Chat - Matrix</strong>
        </p>
        <p>
          <a href="https://matrix.to/#/#prayer-book:matrix.org" rel="noopener" target="_blank"
             class="text-sky-600">
            <pre>#prayer-book:matrix.org</pre>
          </a>
        </p>
      </div>
    </RoundMain>
  </BgWithHeader>
</template>
