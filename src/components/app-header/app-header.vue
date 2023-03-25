<template>
  <v-app-bar
    title="Smart shopping"
    :absolute="true"
    color="light-blue-darken-4"
  >
    <template v-slot:prepend>
      <v-app-bar-nav-icon
        v-if="sharedListsRequests.length"
        @click="onMenuDrawerToggle"
      >
        <v-badge dot color="error">
          <v-icon icon="mdi-menu" />
        </v-badge>
      </v-app-bar-nav-icon>
      <v-app-bar-nav-icon
        v-else
        @click="onMenuDrawerToggle"
      />
    </template>
    <template #append>
      <header-loading-button />
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSettingsStore } from '../../stores/settingsStore'
import HeaderLoadingButton from './header-loading-button.vue';

const settingsStore = useSettingsStore()
const sharedListsRequests = computed(() => settingsStore.userSettings?.sharedListsRequests || [])

const onMenuDrawerToggle = () => {
  settingsStore.optionsMenuIsOpen = !settingsStore.optionsMenuIsOpen
}
</script>

<style scoped>
</style>
