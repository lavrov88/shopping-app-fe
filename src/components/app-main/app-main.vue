<template>
  <v-main class="app-main">
    <div class="app-main-progressbar">
      <!-- <v-progress-linear
        v-if="isFetching"
        :height="6"
        color="blue"
        indeterminate
      /> -->
    </div>
    <transition-group
      v-if="listIds.length"
      name="list-items"
      tag="div"
      class="list-items"
    >
      <div
        v-for="listId in listIds"
        :key="listId"
        class="list-item-wrapper"
      >
        <list-item :listId="listId" />
      </div>
    </transition-group>
    <div v-else class="list-items-empty">
      <div>
        <v-icon size="48" color="grey" icon="mdi-shopping-outline" />
      </div>
      <div>
        <span>There are still no lists...</span><br>
        <span>Open menu to create the first one.</span>
      </div>
    </div>
    <dialog-add-purchases />
    <dialog-manage-purchases />
  </v-main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useListsStore } from '../../stores/listsStore';
import { useSettingsStore } from '../../stores/settingsStore';

import ListItem from './list-item/list-item.vue';
import DialogAddPurchases from '../app-dialogs/dialog-add-purchases.vue';
import DialogManagePurchases from '../app-dialogs/dialog-manage-purchases/dialog-manage-purchases.vue';

const listsStore = useListsStore()
const settingsStore = useSettingsStore()

let listIds = computed(() => listsStore.sortedLists.map(l => l.id))
const isFetching = computed(() => settingsStore.anyDataIsFetching)
</script>

<style scoped>
.app-main {
  position: relative;
  padding: 84px 20px 20px;
  min-height: 400px;
}
.app-main-progressbar {
  position: absolute;
  top: 64px;
  left: 0;
  height: 10px;
  width: 100%;
}
.list-items {
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding-bottom: 70px;
}
.list-items-empty {
  margin-top: 100px;
  display: flex;
  justify-content: center;
  gap: 20px;
}


/* TRANSITION ANIMATION */

.list-item-wrapper {
  transition: all 0.5s ease;
}

.list-items-enter-from,
.list-items-leave-to {
  opacity: 0;
  transform: scale(0);
}

.list-items-leave-active {
  position: absolute;
}
</style>
