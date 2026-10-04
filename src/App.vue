<script setup>
import {RouterLink, RouterView} from "vue-router";
import {App} from "@capacitor/app";
import {ref} from "vue";
import IconHamburger from "@/components/icons/IconHamburger.vue";
import IconHomeModern from "@/components/icons/IconHomeModern.vue";
import IconBolt from "@/components/icons/IconBolt.vue";
import IconListBullet from "@/components/icons/IconListBullet.vue";
import IconLightBulb from "@/components/icons/IconLightBulb.vue";
import IconCog from "@/components/icons/IconCog.vue";
import IconChat from "@/components/icons/IconChat.vue";
import IconCloud from "@/components/icons/IconCloud.vue";
import IconPencil from "@/components/icons/IconPencil.vue";
import IconBookmark from "@/components/icons/IconBookmark.vue";

// https://ionic.io/blog/take-control-of-your-capacitor-app-state
App.addListener("backButton", (data) => {
  console.log("back button click:", JSON.stringify(data));
  if (data.canGoBack) {
    window.history.back();
  } else {
    // Maybe show alert before closing app?
    App.exitApp();
  }
});

// Close menu when screen orientation changes because the menu can have wrong height
screen.orientation.addEventListener("change", () => {
  closeMenu();
});

const menuVisible = ref(false);

function toggleMenu() {
  if (menuVisible.value) {
    closeMenu();
  } else {
    openMenu();
  }
}

function openMenu() {
  menuVisible.value = true;

  // When menu is opened, we want to scroll only menu, not the whole page.
  document.querySelector("body").style.overflow = "hidden";

  // Menu is positioned 'fixed' and covers the whole viewport.
  // If the menu height is larger than the viewport, we set the height of the menu to the height of the navigation.
  // so it can be scrolled. The fixed element can be scrolled only if it has a height set.
  const navigationTop = document.querySelector("#navigation-top");
  const navigationBottom = document.querySelector("#navigation-bottom");
  const rootStyle = getComputedStyle(document.documentElement);
  const safeAreaInsetTop = parseInt(rootStyle.getPropertyValue("--sat"), 10);
  const safeAreaInsetBottom = parseInt(rootStyle.getPropertyValue("--sab"), 10);
  const navigationHeight = navigationTop.offsetHeight + navigationBottom.offsetHeight
    + safeAreaInsetTop + safeAreaInsetBottom;
  if (navigationHeight > window.innerHeight) {
    document.querySelector("#navigation-wrapper").style.height = navigationHeight + "px";
  }
}

function closeMenu() {
  menuVisible.value = false;
  // When menu is closed, we want to scroll the whole page again.
  document.querySelector("body").style.overflow = "auto";
  // Reset the height of the menu to 100% so it covers the whole viewport again.
  document.querySelector("#navigation-wrapper").style.height = "100%";
}
</script>

<template>
  <!-- The padding makes a 48px touch target, the margins keep the icon 14px from the edges -->
  <button
    v-show="!menuVisible"
    :aria-label="$t('menu.open')"
    class="absolute top-0 left-0 z-30 p-3 text-gray-100"
    style="margin-top: calc(2px + env(safe-area-inset-top)); margin-left: calc(2px + env(safe-area-inset-left));"
    @click="toggleMenu"
  >
    <IconHamburger />
  </button>

  <nav :class="['fixed flex flex-row h-full w-full z-40 overflow-scroll', { 'invisible': !menuVisible }]">
    <div
      id="navigation-wrapper"
      class="flex flex-col justify-between min-w-[250px] max-w-[90%] bg-sky-500 text-gray-100
                dark:bg-sky-700 dark:text-gray-300"
      style="padding-top: env(safe-area-inset-top); padding-left: env(safe-area-inset-left);
             padding-bottom: env(safe-area-inset-bottom);"
    >
      <div
        id="navigation-top"
        class="flex flex-col ml-3.5 pb-10 text-2xl leading-loose"
      >
        <button
          :aria-label="$t('menu.close')"
          @click="toggleMenu"
        >
          <IconHamburger class="z-30 mt-3.5 mb-6 text-gray-100" />
        </button>

        <div class="flex -ml-3.5 items-center mb-6">
          <RouterLink
            to="/"
            class="flex grow justify-center mx-3 font-bold"
            @click="closeMenu"
          >
            {{ $t("prayerBook") }}
          </RouterLink>
        </div>

        <div class="flex items-center">
          <IconHomeModern />
          <RouterLink
            to="/category/basic"
            class="mx-3"
            @click="closeMenu"
          >
            {{ $t("category.basic") }}
          </RouterLink>
        </div>
        <div class="flex items-center">
          <IconBolt />
          <RouterLink
            to="/category/rosary"
            class="mx-3"
            @click="closeMenu"
          >
            {{ $t("category.rosary") }}
          </RouterLink>
        </div>
        <div class="flex items-center">
          <IconListBullet />
          <RouterLink
            to="/category/litany"
            class="mx-3"
            @click="closeMenu"
          >
            {{ $t("category.litany") }}
          </RouterLink>
        </div>
        <div class="flex items-center">
          <IconCloud />
          <RouterLink
            to="/category/saints"
            class="mx-3"
            @click="closeMenu"
          >
            {{ $t("category.saints") }}
          </RouterLink>
        </div>
        <div class="flex items-center">
          <IconLightBulb />
          <RouterLink
            to="/category/other"
            class="mx-3"
            @click="closeMenu"
          >
            {{ $t("category.other") }}
          </RouterLink>
        </div>
        <div class="flex items-center">
          <IconPencil />
          <RouterLink
            to="/category/custom"
            class="mx-3"
            @click="closeMenu"
          >
            {{ $t("category.custom") }}
          </RouterLink>
        </div>
        <div class="flex items-center">
          <IconBookmark />
          <RouterLink
            to="/category/bookmarks"
            class="mx-3"
            @click="closeMenu"
          >
            {{ $t("category.bookmarks") }}
          </RouterLink>
        </div>
      </div>
      <div
        id="navigation-bottom"
        class="flex flex-col ml-3.5 mb-3.5 text-xl leading-loose"
      >
        <div class="flex items-center">
          <IconCog />
          <RouterLink
            to="/settings"
            class="mx-3"
            @click="closeMenu"
          >
            {{ $t("menu.settings") }}
          </RouterLink>
        </div>
        <div class="flex items-center">
          <IconChat />
          <a
            href="mailto:hi@jozo.io"
            class="mx-3"
          >
            {{ $t("menu.suggestions") }}
          </a>
        </div>
      </div>
    </div>
    <div
      class="grow"
      @click="closeMenu"
    />
  </nav>

  <main class="flex flex-col grow">
    <RouterView />
  </main>
</template>
