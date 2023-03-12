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
        v-if="!isAuthorized"
        title="Profile"
        subtitle="You are not logged in"
      />
      <v-list-item
        v-if="isAuthorized"
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
      <!-- <v-list-item
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
      ></v-list-item> -->
      <v-list-item
        v-if="isAuthorized"
        @click="onDeleteAllCheckedClick"
        prepend-icon="mdi-delete-sweep"
        title="Delete checked in all lists"
      ></v-list-item>
      <v-list-item
        v-if="isAuthorized"
        @click="onManageListsClick"
        prepend-icon="mdi-playlist-edit"
        title="Manage lists"
      ></v-list-item>
    </v-list>

    <v-divider />

    <v-list density="compact" nav>
      <v-list-item
        v-if="isAuthorized"
        prepend-icon="mdi-cog"
        title="Settings"
      ></v-list-item>
    </v-list>

  </v-navigation-drawer>
  <dialog-login />
  <dialog-manage-lists />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useListsStore } from '../../stores/listsStore';
import { useSettingsStore } from '../../stores/settingsStore'
import DialogLogin from '../app-dialogs/dialog-login.vue';
import DialogManageLists from '../app-dialogs/dialog-manage-lists/dialog-manage-lists.vue';

const settingsStore = useSettingsStore()
const listsStore = useListsStore()

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
</style>
