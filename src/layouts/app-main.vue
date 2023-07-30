<template>
  <div class="main-layout">
    <v-card
      class="main-layout-card"
      :rounded="true"
    >
      <app-header />

      <main class="app-main-lists">
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
        <dialog-share-list />
        <dialog-shared-lists-requests />

      </main>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useListsStore } from '../stores/listsStore'

import AppHeader from '../components/app-header/app-header.vue'
import ListItem from '../components/app-list-item/list-item.vue'
import DialogAddPurchases from '../components/app-dialogs/dialog-add-purchases.vue'
import DialogManagePurchases from '../components/app-dialogs/dialog-manage-purchases/dialog-manage-purchases.vue'
import DialogShareList from '../components/app-dialogs/dialog-share-list.vue'
import DialogSharedListsRequests from '../components/app-dialogs/dialog-shared-lists-requests.vue'

const listsStore = useListsStore()

let listIds = computed(() => listsStore.sortedLists.map(l => l.id))
</script>

<style>
.main-layout {
  width: 500px;
  margin-top: 40px;
  margin-left: auto;
  margin-right: auto;
}
.main-layout > .v-card {
  border-radius: 10px;
}
.app-main-lists {
  position: relative;
  padding: 84px 20px 20px;
  min-height: 400px;
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

/* MOBILE */

@media (max-width: 600px) {
  html {
    overflow-y: hidden !important;
  }
  .main-layout {
    width: 100vw;
    margin-top: 0;;
  }
  .main-layout > .v-card {
  border-radius: 0px;
  }
  .app-main-lists {
    height: 100vh;
    padding: 74px 5px 5px;
    overflow-y: auto;
    background-color: #eee;
  }
  .list-items {
    padding-bottom: 50px;
  }
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
