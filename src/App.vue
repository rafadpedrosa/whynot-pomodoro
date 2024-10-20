<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'

import {invoke} from '@tauri-apps/api'
import {onMounted, ref} from "vue";
import {moveWindow, Position} from "tauri-plugin-positioner-api";
import {register, isRegistered} from '@tauri-apps/api/globalShortcut';
import {appWindow} from "@tauri-apps/api/window";

const msgResponse = ref('')
const isControlAltKRegistered = ref('')

moveWindow(Position.TopRight);

const isFistLoad = localStorage.getItem('isFirstLoad');
localStorage.setItem('isOpen', true);

if(isFistLoad === null) {
  localStorage.setItem('isFirstLoad', false);

  appWindow.hide();
  localStorage.setItem('isOpen', false);
  console.log('First load');
}

onMounted(async () => {

  try {
    msgResponse.value = await invoke('greet', {name: 'World'});
  } catch (error) {
    console.error(error);
  }

  isControlAltKRegistered.value = await isRegistered('CommandOrControl+Alt+K');

  if (!isControlAltKRegistered.value) {
    await register('CommandOrControl+Alt+K', async () => {
      isControlAltKRegistered.value = await isRegistered('CommandOrControl+Alt+K');

      const isOpen = localStorage.getItem('isOpen');

      console.log('isOpen', isOpen);
      if (isOpen === 'true') {
        appWindow.hide();
        localStorage.setItem('isOpen', false);
      } else {
        localStorage.setItem('isOpen', true);
        appWindow.show();
        moveWindow(Position.TopRight);
      }
    });
  }
});
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo"/>
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo"/>
    </a>
  </div>
  Here:: {{ msgResponse }}
  <HelloWorld msg="Vite + Vue"/>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
