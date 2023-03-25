<template>
  <v-navigation-drawer
    v-model="menuDrawerIsOpen"
    @update:modelValue="onMenuDrawerToggle"
    temporary
  >
    <v-list-item title="Options" />

    <v-divider />

    <v-list density="compact" nav>
      <v-list-item
        :title="username as string"
        subtitle="You are logged in"
        class="navbar-user-profile"
      >
        <template class="user-avatar" #prepend>
          <v-icon
            icon="mdi-account-circle"
            size="x-large"
            color="light-blue-darken-4" 
          />
        </template>
      </v-list-item>
      <div class="pa-2">
        <v-btn
          @click="onProfileSettingsClick"
          block
          color="light-blue-darken-4"
          variant="outlined"
          size="small"
        >
          Profile settings
        </v-btn>
      </div>
    </v-list>

    <v-divider />

    <v-list density="compact" nav>
      <v-list-item
        v-if="sharedListsToConfirm.length"
        @click="onConfirmNewSharedListsClick"
        prepend-icon="mdi-account-multiple-plus"
        title="Confirm new shared lists"
      >
        <template #append>
          <div class="navbar-item-badge">
            <v-badge dot color="error" />
          </div>
        </template>
      </v-list-item>

      <v-list-item
        @click="onDeleteAllCheckedClick"
        prepend-icon="mdi-delete-sweep"
        title="Delete checked in all lists"
      ></v-list-item>

      <v-list-item
        @click="onManageListsClick"
        prepend-icon="mdi-playlist-edit"
        title="Manage lists"
      ></v-list-item>
    </v-list>

    <v-divider />

    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-cog"
        title="Settings"
      ></v-list-item>
    </v-list>

  </v-navigation-drawer>

  <dialog-profile />
  <dialog-manage-lists />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useListsStore } from '../../stores/listsStore';
import { useSettingsStore } from '../../stores/settingsStore'
import DialogManageLists from '../app-dialogs/dialog-manage-lists/dialog-manage-lists.vue';
import DialogProfile from '../app-dialogs/dialog-profile.vue';

const settingsStore = useSettingsStore()
const listsStore = useListsStore()
const menuDrawerIsOpen = computed(() => settingsStore.optionsMenuIsOpen)
const username = computed(() => settingsStore.user && settingsStore.user.username)
const sharedListsToConfirm = computed(() => settingsStore.userSettings?.sharedListsRequests || [])

const onMenuDrawerToggle = (value: boolean) => {
  settingsStore.optionsMenuIsOpen = value
}
const onProfileSettingsClick = () => {
  settingsStore.profileDialogIsOpen = true
  settingsStore.optionsMenuIsOpen = false
}
const onConfirmNewSharedListsClick = () => {
  settingsStore.shareListsRequestsDialogIsOpen = true
  settingsStore.optionsMenuIsOpen = false
}
const onDeleteAllCheckedClick = () => {
  listsStore.deleteCheckedPurchasesInAllLists()
  settingsStore.optionsMenuIsOpen = false
}
const onManageListsClick = () => {
  settingsStore.listsManageDialogIsOpen = true
  settingsStore.optionsMenuIsOpen = false
}
</script>

<style>
.v-navigation-drawer__content .v-list-item__prepend {
  width: 50px;
}
.navbar-item-badge {
  transform: translateY(-9px);
}
</style>
