<template>
  <v-expansion-panels v-model="isMinimized" multiple>
    <v-expansion-panel
      class="list-item-inner"
      :color="list.color"
      rounded="lg"
      collapse-icon=""
      expand-icon=""
    >
      <template #title>
        <div class="list-item-title">
          <div class="list-item-title__item left">
            <v-icon icon="mdi-menu-down"></v-icon>
            <strong>{{ list.name }}</strong>
          </div>
          <div class="list-item-title__item right">
            <v-badge
              v-if="!isMinimized.length"
              color="rgba(255,255,255,0.2)"
              text-color="#fff"
              :content="itemsCountString"
              inline
            ></v-badge>
            <div class="list-item-title__toggle-menu">
              <v-icon icon="mdi-dots-horizontal" size="x-large" />
              <v-menu
                activator="parent"
                location="left"
              >
                <v-list>
                  <v-list-item
                    v-for="item in listMenuItems"
                    @click="openManagePurchasesDialog"
                    :key="item.name"
                  >
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>
        </div>
      </template>
      <template #text>
        <div class="purchases-list">
          <list-item-purchase
            v-for="purchase in list.items"
            :key="purchase.id"
            @toggleChecked="onTogglePuchaseChecked"
            @deleteItem="onDeletePurchase"
            :purchase="purchase"
            :color="list.color"
          />
        </div>
      </template>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useListsStore } from '../../../stores/listsStore';
import { useSettingsStore } from '../../../stores/settingsStore';
import { ListItem, PurchaseItem } from '../../../stores/listsStore';
import ListItemPurchase from './list-item-purchase.vue'
const listsStore = useListsStore()
const settingsStore = useSettingsStore()

interface Props {
  list: ListItem
}
const { list } = defineProps<Props>()

const isMinimized = computed({
  get() {
    const minimized = settingsStore.userSettings?.minimizedLists.includes(list.id)
    return minimized ? [] : [0]
  },

  set() {
    settingsStore.toggleMinimizeList(list.id)
  }
})

const openManagePurchasesDialog = () => {
  settingsStore.openPurchasesManageDialog(list.id)
}

const itemsCountString = computed(() => {
  const count = list.items.length
  return `${count} ${count === 1 ? 'item' : 'items'}`
})

const listMenuItems = [
  { name: 'Edit purchases', icon: null, onClick: openManagePurchasesDialog },
]

const onTogglePuchaseChecked = (purchase: PurchaseItem) => {
  listsStore.editPurchases(list.id, [purchase])
}
const onDeletePurchase = (purchase: PurchaseItem) => {
  listsStore.deletePurchases(list.id, [purchase])
}
</script>

<style>
.list-item-inner > .v-expansion-panel-title {
  min-height: 40px !important;
  /* padding-top: 0;
  padding-bottom: 0; */
  padding: 0 10px;
}
.list-item-inner .v-expansion-panel-text__wrapper {
  padding: 15px;
}
.list-item-inner .v-expansion-panel-title__icon {
  display: none;
}
.list-item-title {
  width: 100%;
}
.list-item-title, .list-item-title__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.list-item-title__item.left {
  gap: 3px;
}
.list-item-title__item.right {
  gap: 5px;
}
.purchases-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
