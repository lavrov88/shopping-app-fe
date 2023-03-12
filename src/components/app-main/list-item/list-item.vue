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
            <list-item-menu :listId="listId" />
          </div>
        </div>
      </template>

      <template #text>
        <v-progress-linear
          v-if="progressBarIsVisible"
          :model-value="progressBarValue"
          :style="progressBarStyle"
          :height="6"
          :color="list.color"
        />
        <transition-group
          name="purchases-list"
          tag="div"
          class="purchases-list"
        >
          <list-item-purchase
            v-for="purchase in itemsSortedAccordingToChecked"
            :key="purchase.id"
            @toggleChecked="onTogglePuchaseChecked"
            @renameItem="onRenameItem"
            @deleteItem="onDeletePurchase"
            :purchaseId="purchase.id"
            :color="list.color"
            :listId="listId"
          />
        </transition-group>
      </template>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useListsStore } from '../../../stores/listsStore';
import { useSettingsStore } from '../../../stores/settingsStore';
import { PurchaseItem } from '../../../stores/listsStore';
import { getIdsSortedAccordingToChecked, sortPurchasesWithIdsArray } from '../../../utils/common';
import { SORT_TIMEOUT } from '../../../utils/constants';

import ListItemPurchase from './list-item-purchase.vue'
import ListItemMenu from './list-item-menu.vue';

const listsStore = useListsStore()
const settingsStore = useSettingsStore()
const { listId } = defineProps<Props>()

// PURCHASES SORTING

const listIdx = computed(() => listsStore.lists.findIndex(l => l.id === listId))
const list = computed(() => listsStore.lists[listIdx.value])
const currentListItems = computed(() => {
  return listsStore.lists[listIdx.value] && listsStore.lists[listIdx.value].items || []
})

const sortedIds = ref(getIdsSortedAccordingToChecked(currentListItems.value))
const sortDelayTimer = ref(0)
const sortDelayTimerStart = ref(0)
const sortDelayTimerEnd = ref(0)

const itemsSortedAccordingToChecked = computed(() => {
  return [ ...currentListItems.value ]
    .sort((a, b) => sortPurchasesWithIdsArray(a, b, sortedIds.value))
})

const refreshSortOrder = () => {
  const currentSortOrderIds = getIdsSortedAccordingToChecked(currentListItems.value)
  sortedIds.value = currentSortOrderIds
}

const startReorderTimer = () => {
  const currentSortedIds = sortedIds
  let newSortedIds = getIdsSortedAccordingToChecked(currentListItems.value)
  let orderWasChanged = false

  clearTimeout(sortDelayTimer.value)
  sortDelayTimerStart.value = +new Date()
  sortDelayTimerEnd.value = sortDelayTimerStart.value + SORT_TIMEOUT

  newSortedIds.forEach((nsi, nsiIdx) => {
    if (currentSortedIds.value[nsiIdx] !== nsi) {
      orderWasChanged = true
    }
  })

  // if order was changed, check purchase remotely after timer, else procceed immediately
  if (orderWasChanged) {
    sortDelayTimer.value = setTimeout(() => {
      refreshSortOrder()
      listsStore.togglePurchasesCheckRemotely(listId)
    }, SORT_TIMEOUT)
  } else {
    listsStore.togglePurchasesCheckRemotely(listId)
  }
}

watch(() => currentListItems.value, refreshSortOrder)

// SORTING PROGRESS BAR

const progressBarStyle = {
  position: 'absolute',
  top: '40px'
}
const progressBarValue = ref(0)
const progressBarInterval = ref(0)
const progressBarIsVisible = ref(false)

watch(sortDelayTimer, () => {
  clearInterval(progressBarInterval.value)
  progressBarValue.value = 0
  progressBarIsVisible.value = true

  progressBarInterval.value = setInterval(() => {
    const start = sortDelayTimerStart.value
    const current = (+new Date()) - start
    const end = sortDelayTimerEnd.value - start

    if (current > end) {
      clearInterval(progressBarInterval.value)
      progressBarIsVisible.value = false
      progressBarValue.value = 0
    }

    progressBarValue.value = current * 100 / ( SORT_TIMEOUT - 300 )
  }, 50)
})

// PURCHASES ACTIONS

const onTogglePuchaseChecked = (purchase: PurchaseItem) => {
  listsStore.togglePurchasesCheckLocally(listId, [purchase])
  startReorderTimer()
}
const onRenameItem = ({ purchase, name }: {purchase: PurchaseItem, name: string}) => {
  listsStore.renamePurchase(listId, purchase, name)
}
const onDeletePurchase = (purchase: PurchaseItem) => {
  listsStore.deletePurchases(listId, [purchase])
}

// HEADER, MINIMIZE

const isMinimized = computed({
  get() {
    const minimized = settingsStore.userSettings?.minimizedLists.includes(listId)
    return minimized ? [] : [0]
  },

  set() {
    settingsStore.toggleMinimizeList(listId)
  }
})

const itemsCountString = computed(() => {
  const count = list.value.items.length
  return `${count} ${count === 1 ? 'item' : 'items'}`
})

// TYPES

interface Props {
  listId: string
}
</script>

<style>
.list-item-inner > .v-expansion-panel-title {
  min-height: 40px !important;
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

/* TRANSITION ANIMATION */

.purchases-list-item {
  transition: all 0.8s ease;
}

.purchases-list-enter-from,
.purchases-list-leave-to {
  opacity: 0;
  transform: scale(0);
}

.purchases-list-leave-active {
  position: absolute;
}
</style>
