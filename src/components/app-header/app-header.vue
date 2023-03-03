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
      <v-btn
        @click="onUpdateClick"
        icon
      >
        <v-icon>mdi-cached</v-icon>
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useListsStore } from '../../stores/listsStore';
import { useSettingsStore } from '../../stores/settingsStore'
const listsStore = useListsStore()
const settingsStore = useSettingsStore()

const onMenuDrawerToggle = () => {
  settingsStore.optionsMenuIsOpen = !settingsStore.optionsMenuIsOpen
}
const onUpdateClick = () => {
  listsStore.getLists()
}

</script>

<style scoped>
</style>
