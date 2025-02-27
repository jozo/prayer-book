<script setup>
import {RouterLink, RouterView} from 'vue-router'
import {App} from '@capacitor/app';
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

// https://ionic.io/blog/take-control-of-your-capacitor-app-state
App.addListener('backButton', (data) => {
  console.log('back button click:', JSON.stringify(data));
  if (data.canGoBack) {
    window.history.back();
  } else {
    // Maybe show alert before closing app?
    App.exitApp();
  }
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
  const body = document.querySelector('body');
  body.style.overflow = 'hidden';
}

function closeMenu() {
  menuVisible.value = false;
  const body = document.querySelector('body');
  body.style.overflow = 'auto';
}
</script>

<template>
  <button @click="toggleMenu">
    <IconHamburger class="absolute z-30 inset-3.5 text-gray-100" />
  </button>

  <nav v-show="menuVisible" class="absolute flex flex-row h-full w-full z-20">
    <div class="flex flex-col justify-between pt-16 min-w-[250px] max-w-[90%] bg-sky-500 text-gray-100
                dark:bg-sky-700 dark:text-gray-300">
      <div class="flex flex-col ml-3.5 text-2xl leading-loose">
        <div class="flex -ml-3.5 items-center mb-6">
          <RouterLink to="/" @click="closeMenu" class="flex grow justify-center mx-3 font-bold">
              {{ $t("prayerBook") }}
          </RouterLink>
        </div>

        <div class="flex items-center">
          <IconHomeModern />
          <RouterLink to="/category/basic" @click="closeMenu" class="mx-3">
            {{ $t("category.basic") }}
          </RouterLink>
        </div>
        <div class="flex items-center">
          <IconBolt />
          <RouterLink to="/category/rosary" @click="closeMenu" class="mx-3">
            {{ $t("category.rosary") }}
          </RouterLink>
        </div>
        <div class="flex items-center">
          <IconListBullet />
          <RouterLink to="/category/litany" @click="closeMenu" class="mx-3">
            {{ $t("category.litany") }}
          </RouterLink>
        </div>
        <div class="flex items-center">
          <IconCloud />
          <RouterLink to="/category/saints" @click="closeMenu" class="mx-3">
            {{ $t("category.saints") }}
          </RouterLink>
        </div>
        <div class="flex items-center">
          <IconLightBulb />
          <RouterLink to="/category/other" @click="closeMenu" class="mx-3">
            {{ $t("category.other") }}
          </RouterLink>
        </div>
        <div class="flex items-center">
          <IconPencil />
          <RouterLink to="/category/custom" @click="closeMenu" class="mx-3">
            {{ $t("category.custom") }}
          </RouterLink>
        </div>
      </div>
      <div class="flex flex-col ml-3.5 mb-3.5 text-xl leading-loose">
        <div class="flex items-center">
          <IconCog />
          <RouterLink to="/settings" @click="closeMenu" class="mx-3">
            {{ $t("menu.settings") }}
          </RouterLink>
        </div>
        <div class="flex items-center">
          <IconChat />
          <a href="mailto:hi@jozo.io" class="mx-3">
            {{ $t("menu.suggestions") }}
          </a>
        </div>
      </div>
    </div>
    <div @click="closeMenu" class="grow"></div>
  </nav>

  <RouterView/>
</template>
