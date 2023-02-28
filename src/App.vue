<template>
  <v-layout>
    <app-alerts />
    <app-nav />
    <div class="main-layout">
      <v-card :rounded="true">
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
const settingsStore = useSettingsStore()

const initApp = () => {
  settingsStore.checkLocalStorageAuth() // check localStorage auth after app started
  if (settingsStore.isAuthorized) {
    settingsStore.getUserSettings()
  }
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
</style>
