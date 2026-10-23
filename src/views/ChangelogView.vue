<script setup>
import BgWithHeader from "@/components/BgWithHeader.vue";
import RoundMain from "@/components/RoundMain.vue";
import {useI18n} from "vue-i18n";
import changelogText from "../../CHANGELOG.md?raw";

const {t} = useI18n({useScope: "global"});

// CHANGELOG.md follows Keep a Changelog: "## [version] - date" headings, "### Added" sections and
// "- item" lines. The intro and the Unreleased section are not shown. Only the page title is
// translated, the changelog is shown as written.
function parseChangelog(text) {
  const releases = [];
  let release = null;
  let section = null;
  for (const line of text.split("\n")) {
    if (line.startsWith("## ")) {
      const match = line.match(/^## \[(.+)\] - (\d{4}-\d{2}-\d{2})/);
      release = match ? {version: match[1], date: match[2], sections: []} : null;
      section = null;
      if (release) {
        releases.push(release);
      }
    } else if (line.startsWith("### ") && release) {
      section = {type: line.slice(4).trim(), items: []};
      release.sections.push(section);
    } else if (line.startsWith("- ") && section) {
      section.items.push(line.slice(2).trim());
    }
  }
  return releases;
}

const releases = parseChangelog(changelogText);
</script>

<template>
  <BgWithHeader :title="t('changelog.title')">
    <RoundMain>
      <section
        v-for="release in releases"
        :key="release.version"
        class="mb-8 last:mb-0 text-left"
      >
        <h2 class="flex items-baseline justify-between gap-2 mb-2">
          <span class="text-xl font-bold">{{ release.version }}</span>
          <span class="text-sm text-neutral-500 dark:text-neutral-400">{{ release.date }}</span>
        </h2>
        <div
          v-for="section in release.sections"
          :key="section.type"
          class="mb-3 last:mb-0"
        >
          <h3 class="mb-1 text-sm font-bold uppercase tracking-wide text-sky-600 dark:text-sky-400">
            {{ section.type }}
          </h3>
          <ul class="ml-5 list-disc">
            <li
              v-for="item in section.items"
              :key="item"
              class="mb-1"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </section>
    </RoundMain>
  </BgWithHeader>
</template>
