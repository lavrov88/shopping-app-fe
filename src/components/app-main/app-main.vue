<template>
  <v-main class="app-main">
    <div class="app-main-progressbar">
      <v-progress-linear
        v-if="listsAreFetching"
        :height="6"
        color="blue"
        indeterminate
      />
    </div>
    <div v-if="lists.length" class="list-items">
      <list-item
        v-for="list in lists"
        :key="list.id"
        :list="list"
      />
    </div>
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

import ListItem from './list-item/list-item.vue';
import DialogAddPurchases from '../app-dialogs/dialog-add-purchases.vue';
import DialogManagePurchases from '../app-dialogs/dialog-manage-purchases/dialog-manage-purchases.vue';

const listsStore = useListsStore()

const lists = computed(() => listsStore.sortedLists)
const listsAreFetching = computed(() => listsStore.listsAreFetching)
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
</style>
