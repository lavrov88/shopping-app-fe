<template>
  <v-layout>
    <app-alerts />
    <app-nav />

    <div v-if="!appIsInitialized" class="app-loader">
      <v-progress-circular
        :size="50"
        color="light-blue-darken-4"
        indeterminate
      ></v-progress-circular>
    </div>

    <div v-if="appIsInitialized" class="main-layout" :class="{ loading: !appIsInitialized }">
      <v-card class="main-layout-card" :rounded="true">
        <app-header />
        <app-main />
      </v-card>
    </div>

  </v-layout>
</template>

<script setup lang="ts">
import { useSettingsStore } from './stores/settingsStore';
import AppHeader from './components/app-header/app-header.vue'
import AppMain from './components/app-main/app-main.vue'
import AppNav from './components/app-nav/app-nav.vue'
import AppAlerts from './components/app-alerts.vue';
import { computed } from 'vue';

const settingsStore = useSettingsStore()
const appIsInitialized = computed(() => settingsStore.appIsInitialized)

const initApp = () => {
  settingsStore.initApp()
}
initApp()
</script>

<style scoped>
.main-layout {
  width: 500px;
  margin-top: 40px;
  margin-left: auto;
  margin-right: auto;
}

.main-layout > .v-card {
  border-radius: 10px;
}

.app-loader {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
