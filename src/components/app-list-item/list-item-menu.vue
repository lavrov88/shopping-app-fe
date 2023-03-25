<template>
  <div class="list-item-title__toggle-menu">
    <v-icon icon="mdi-dots-horizontal" size="x-large" />
    <v-menu
      activator="parent"
      location="left"
    >
      <v-list>
        <v-list-item
          v-for="item in listMenuItems"
          :key="item.name"
          @click="item.onClick"
          :prepend-icon="item.icon"
        >
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>

  <dialog-confirm
    @cancel="deleteAllConfirmIsOpen = false"
    @confirm="onConfimDeleteAll"
    :is-open="deleteAllConfirmIsOpen"
    title="Delete all"
    confirm-btn-style="red"
  >
    Are you sure you want to delete all purchases in list
    <span class="delete-all-confirm-list-name">{{ list?.name || '' }}</span>?
  </dialog-confirm>
</template>

<script setup lang="ts">
import { useSettingsStore } from '../../stores/settingsStore'
import { useListsStore } from '../../stores/listsStore'
import { ref } from 'vue';
import DialogConfirm from '../app-dialogs/dialog-confirm.vue'

const { listId } = defineProps<Props>()
const settingsStore = useSettingsStore()
const listsStore = useListsStore()
const list = listsStore.lists.find(l => l.id === listId)


// MANAGE PURCHASES

const openManagePurchasesDialog = () => {
  settingsStore.openManagePurchasesDialog(listId)
}

// SHARE LIST

const openShareListDialog = () => {
  settingsStore.openShareListDialog(listId)
}


// DELETE

const deleteCheckedPurchases = () => {
  listsStore.deleteCheckedPurchasesInList(listId)
}

const deleteAllConfirmIsOpen = ref(false)
const openDeleteAllConfirm = () => {
  deleteAllConfirmIsOpen.value = true
}
const onConfimDeleteAll = () => {
  listsStore.deleteAllPurchasesInList(listId)
  deleteAllConfirmIsOpen.value = false
}

// MENU ITEMS

const listMenuItems = [
  {
    name: 'Edit purchases',
    icon: 'mdi-text-box-edit-outline',
    onClick: openManagePurchasesDialog
  },
  {
    name: 'Share list',
    icon: 'mdi-account-group',
    onClick: openShareListDialog
  },
  {
    name: 'Delete checked purchases',
    icon: 'mdi-list-status',
    onClick: deleteCheckedPurchases
  },
  {
    name: 'Delete all purchases',
    icon: 'mdi-playlist-remove',
    onClick: openDeleteAllConfirm
  },
]

interface Props {
  listId: string
}
</script>

<style>
.delete-all-confirm-list-name {
  font-weight: 700;
  text-transform: capitalize;
}
</style>
