<script setup lang="ts">
import ListItem from './list-item/list-item.vue';
import AppMainAddDialog from './app-main-add-dialog.vue';
import { useListsStore } from '../../stores/listsStore';
import { computed } from 'vue';
const listsStore = useListsStore()

const lists = computed(() => listsStore.lists)
const listsAreFetching = computed(() => listsStore.listsAreFetching)

</script>

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
    <app-main-add-dialog />
  </v-main>
</template>

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
