<script setup>
import {RouterLink, RouterView} from 'vue-router'
import {App} from '@capacitor/app';

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
</script>

<template>
  <header class="bg-sky-400 py-3 mb-3 text-center text-lg">
    <nav class="overflow-scroll whitespace-nowrap">
      <RouterLink to="/category/basic" class="mx-2">Základné</RouterLink>
      <RouterLink to="/category/saints" class="mx-2">K svätým</RouterLink>
      <RouterLink to="/category/rosary" class="mx-2">Ruženec</RouterLink>
      <RouterLink to="/category/litany" class="mx-2">Litánie</RouterLink>
      <RouterLink to="/about" class="mx-2">O appke</RouterLink>
    </nav>
  </header>

  <main class="m-2">
    <RouterView/>
  </main>
</template>
