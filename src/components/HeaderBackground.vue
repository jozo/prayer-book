<script setup>
import {onBeforeUnmount, onMounted, ref, useTemplateRef} from "vue";

// Place this component inside a page header. It draws the header's gradient as a fixed background, so
// only the title and the content scroll over it. The app is drawn edge to edge, under a transparent
// status bar, so it also keeps the top of the gradient under the status bar above the scrolled content.

// How far below the status bar the scrolled content fades in
const FADE_LENGTH = 32;

const anchor = useTemplateRef("anchor");
const headerHeight = ref(0);
const fadeLength = ref(0);
let observer;

// At the top of the page the fade would cover the menu button, so it grows only as the page scrolls
function updateFadeLength() {
  fadeLength.value = Math.min(FADE_LENGTH, window.scrollY);
}

onMounted(() => {
  // The background has the size of the header it is placed in
  const header = anchor.value.parentElement;
  observer = new ResizeObserver(([entry]) => {
    // Use the fractional height, a rounded one makes the gradient under the status bar visibly
    // differ from the background
    headerHeight.value = entry.borderBoxSize[0].blockSize;
  });
  observer.observe(header);

  updateFadeLength();
  window.addEventListener("scroll", updateFadeLength, {passive: true});
});

onBeforeUnmount(() => {
  observer.disconnect();
  window.removeEventListener("scroll", updateFadeLength);
});
</script>

<template>
  <span
    ref="anchor"
    hidden
  />
  <!-- Teleport out of the header's stacking context: the background goes below all page content,
       the status bar above it, including the menu button -->
  <Teleport to="body">
    <div
      id="header-background"
      class="fixed top-0 inset-x-0 -z-10 rounded-b-2xl bg-linear-to-b from-cyan-500 to-blue-500
              dark:from-cyan-800 dark:to-blue-800"
      :style="{height: `${headerHeight}px`}"
    />
    <!-- Content scrolled under the status bar is cut off, and so is the shadow around it. A hard edge
         would show where the shadow stops, so the strip reaches below the status bar and fades out.
         Without a status bar there is no strip at all. -->
    <div
      id="status-bar"
      class="fixed top-0 inset-x-0 z-[35] bg-no-repeat bg-linear-to-b from-cyan-500 to-blue-500
              dark:from-cyan-800 dark:to-blue-800"
      :style="{
        height: `calc(env(safe-area-inset-top) + min(${fadeLength}px, env(safe-area-inset-top)))`,
        backgroundSize: `100% ${headerHeight}px`,
        maskImage: 'linear-gradient(to bottom, black env(safe-area-inset-top), transparent)'
      }"
    />
  </Teleport>
</template>
