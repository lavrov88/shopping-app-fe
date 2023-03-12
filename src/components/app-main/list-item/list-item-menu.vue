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

  <v-dialog
      v-model="deleteAllConfirmIsOpen"
      width="auto"
      :max-width="400"
    >
      <v-card
        title="Delete all"
      >
        <template v-slot:text>
          <div class="purchase-confirmation-popup__text">
            Are you sure you want to delete all purchases in list <span>{{ list?.name || '' }}</span>?
          </div>

          <div class="purchase-confirmation-popup__footer">
            <v-btn
              @click="onConfimDeleteAll"
              color="red-darken-2"
              style="width: 48%;"
            >
              Confirm
            </v-btn>
            <v-btn
              @click="deleteAllConfirmIsOpen = false"
              variant="outlined"
              color="blue"
              style="width: 48%;"
            >
              Cancel
            </v-btn>
          </div>
        </template>

      </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { useSettingsStore } from '../../../stores/settingsStore';
import { useListsStore } from '../../../stores/listsStore';
import { ref } from 'vue';

const { listId } = defineProps<Props>()
const settingsStore = useSettingsStore()
const listsStore = useListsStore()
const list = listsStore.lists.find(l => l.id === listId)


// MANAGE PURCHASES

const openManagePurchasesDialog = () => {
  settingsStore.openPurchasesManageDialog(listId)
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
</style>
