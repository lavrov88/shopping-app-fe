<template>
  <v-app-bar
    title="Smart shopping"
    :absolute="true"
    color="light-blue-darken-4"
  >
    <template v-slot:prepend>
      <v-app-bar-nav-icon
        @click="onMenuDrawerToggle"
      />
    </template>
    <template v-slot:append>
      <header-loading-button />
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useSettingsStore } from '../../stores/settingsStore'
import HeaderLoadingButton from './header-loading-button.vue';

const settingsStore = useSettingsStore()

const onMenuDrawerToggle = () => {
  settingsStore.optionsMenuIsOpen = !settingsStore.optionsMenuIsOpen
}
</script>

<style scoped>
</style>
