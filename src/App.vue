<template>
  <v-layout>

    <app-alerts />
    <app-nav />

    <app-loader v-if="!appIsInitialized" />
    <app-main v-if="appIsInitialized && isAuthorized" />

    <app-login
      v-if="appIsInitialized && !isAuthorized && !registerIsActive"
      @toggle-to-register="registerIsActive = true"
    />
    <app-register
      v-if="appIsInitialized && !isAuthorized && registerIsActive"
      @toggle-to-login="registerIsActive = false"
    />

  </v-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useSettingsStore } from './stores/settingsStore';

import AppMain from './layouts/app-main.vue'
import AppLoader from './layouts/app-loader.vue'
import AppAlerts from './components/app-alerts.vue';
import AppNav from './components/app-nav/app-nav.vue'
import AppLogin from './layouts/app-login.vue'
import AppRegister from './layouts/app-register.vue';

const settingsStore = useSettingsStore()
const appIsInitialized = computed(() => settingsStore.appIsInitialized)
const isAuthorized = computed(() => settingsStore.isAuthorized)

const registerIsActive = ref(false)

const initApp = () => {
  settingsStore.initApp()
}
initApp()
</script>