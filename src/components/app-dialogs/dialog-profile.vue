<template>
  <v-dialog
    v-model="dialogIsOpen"
    width="450"
  >
    <v-card
      title="Profile"
      :subtitle="username"
    >
      <v-card-text>
        <v-btn
          @click="onLogoutClick"
          color="red"
          block
        >
          Logout
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSettingsStore } from '../../stores/settingsStore';

const settingsStore = useSettingsStore()

const username = settingsStore.user?.username

// LOGOUT

const onLogoutClick = () => {
  settingsStore.logout()
  dialogIsOpen.value = false
}

// OPEN-CLOSE DIALOG

const dialogIsOpen = computed({
  get: () => settingsStore.profileDialogIsOpen,
  set: () => settingsStore.profileDialogIsOpen = !settingsStore.profileDialogIsOpen,
})
</script>

<style>
</style>
