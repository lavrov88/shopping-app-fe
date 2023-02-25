<script setup lang="ts">
import { useSettingsStore } from './stores/settingsStore';
import AppHeader from './components/app-header/app-header.vue'
import AppMain from './components/app-main/app-main.vue'
import AppNav from './components/app-nav/app-nav.vue'
const settingsStore = useSettingsStore()

settingsStore.checkLocalStorageAuth()
</script>

<template>
  <v-layout>
    <app-nav />
    <div class="main-layout">
      <v-card :rounded="true">
        <app-header />
        <app-main />
      </v-card>
    </div>
  </v-layout>
</template>

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
