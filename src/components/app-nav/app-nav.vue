<script setup lang="ts">
import { computed } from 'vue';
import { useSettingsStore } from '../../stores/settingsStore'
import AppNavLoginDialog from './app-nav-login-dialog.vue';

const settingsStore = useSettingsStore()

const menuDrawerIsOpen = computed(() => settingsStore.optionsMenuIsOpen)
const onMenuDrawerToggle = (value: boolean) => {
  settingsStore.optionsMenuIsOpen = value
}

const isAuthorized = computed(() => settingsStore.isAuthorized)
const username = computed(() => settingsStore.user && settingsStore.user.username)

const onLoginClick = () => {
  settingsStore.loginDialogIsOpen = true
}
const onLogoutClick = () => {
  settingsStore.logout()
}
</script>

<template>
  <v-navigation-drawer
    v-model="menuDrawerIsOpen"
    @update:modelValue="onMenuDrawerToggle"
    temporary
  >
    <v-list-item
      title="Options"
    ></v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        v-if="!isAuthorized"
        title="Profile"
        subtitle="You are not logged in"
      ></v-list-item>
      <v-list-item
        v-if="isAuthorized"
        :title="username as string"
        subtitle="You are logged in"
      ></v-list-item>
      <v-list-item
        v-if="!isAuthorized"
        @click="onLoginClick"
        prepend-icon="mdi-view-dashboard"
        title="Login"
        value="Login"
        variant="tonal"
      ></v-list-item>
      <v-list-item
        v-if="isAuthorized"
        @click="onLogoutClick"
        prepend-icon="mdi-view-dashboard"
        title="Logout"
        value="Logout"
        variant="tonal"
      ></v-list-item>
    </v-list>
    <v-divider></v-divider>

  </v-navigation-drawer>
  <app-nav-login-dialog />
</template>

<style scoped>
</style>
