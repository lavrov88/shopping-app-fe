<template>
  <v-layout>

    <app-alerts />
    <app-nav />

    <app-loader v-if="!appIsInitialized" />
    <app-main v-if="appIsInitialized && isAuthorized" />
    <app-login v-if="appIsInitialized && !isAuthorized" />

  </v-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSettingsStore } from './stores/settingsStore';

import AppMain from './layouts/app-main.vue'
import AppLogin from './layouts/app-login.vue'
import AppLoader from './layouts/app-loader.vue'
import AppAlerts from './components/app-alerts.vue';
import AppNav from './components/app-nav/app-nav.vue'

const settingsStore = useSettingsStore()
const appIsInitialized = computed(() => settingsStore.appIsInitialized)
const isAuthorized = computed(() => settingsStore.isAuthorized)

const initApp = () => {
  settingsStore.initApp()
}
initApp()
</script>