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

function closeMenu() {
  menuVisible.value = false;
}
</script>

<template>
  <button @click="menuVisible = !menuVisible">
    <IconHamburger class="absolute z-30 inset-3.5 text-gray-100" />
  </button>

  <nav v-show="menuVisible"
       class="absolute flex flex-col justify-between pt-16 min-w-[250px] max-w-[90%] h-full z-20
              bg-sky-500 text-gray-100">
    <div class="flex flex-col ml-3.5 text-2xl leading-loose">
      <div class="flex items-center">
        <IconHomeModern />
        <RouterLink to="/category/basic" @click="closeMenu" class="mx-3">Základné</RouterLink>
      </div>
      <div class="flex items-center">
        <IconBolt />
        <RouterLink to="/category/rosary" @click="closeMenu" class="mx-3">Ruženec</RouterLink>
      </div>
      <div class="flex items-center">
        <IconListBullet />
        <RouterLink to="/category/litany" @click="closeMenu" class="mx-3">Litánie</RouterLink>
      </div>
      <div class="flex items-center">
        <IconLightBulb />
        <RouterLink to="/category/saints" @click="closeMenu" class="mx-3">K svätým</RouterLink>
      </div>
    </div>
    <div class="flex flex-col ml-3.5 mb-3.5 text-xl leading-loose">
      <div class="flex items-center">
        <IconCog />
        <RouterLink to="/settings" @click="closeMenu" class="mx-3">Nastavenia</RouterLink>
      </div>
      <div class="flex items-center">
        <IconChat />
        <a href="mailto:hi@jozo.io" class="mx-3">Nápad na vylepšenie</a>
      </div>
    </div>
  </nav>

  <RouterView/>
</template>
