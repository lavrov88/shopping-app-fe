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
const isMinimized = computed(() => {
  const minimized = settingsStore.userSettings?.minimizedLists.includes(list.id)
  return minimized ? [] : [0]
})

const onTogglePuchaseChecked = (purchase: PurchaseItem) => {
  listsStore.editPurchases(list.id, [purchase])
}
</script>

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
            <v-icon icon="mdi-dots-horizontal" size="x-large" />
            <v-menu
              activator="parent"
              location="left"
            >
              <v-list>
                <v-list-item
                  v-for="(item, index) in 4"
                  :key="index"
                  :value="index"
                >
                  <v-list-item-title>Menu item {{ index + 1 }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
      </template>
      <template #text>
        <div class="purchases-list">
          <list-item-purchase
            v-for="purchase in list.items"
            :key="purchase.id"
            @toggleChecked="onTogglePuchaseChecked"
            :purchase="purchase"
            :color="list.color"
          />
        </div>
      </template>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

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
.purchases-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
