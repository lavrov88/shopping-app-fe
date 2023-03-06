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
        <v-progress-linear
          v-if="progressBarIsVisible"
          :model-value="progressBarValue"
          :style="progressBarStyle"
          :height="6"
          :color="list.color"
        />
        <div class="purchases-list">
          <list-item-purchase
            v-for="purchase in itemsSortedAccordingToChecked"
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
import { computed, ref, watch } from 'vue';
import { useListsStore } from '../../../stores/listsStore';
import { useSettingsStore } from '../../../stores/settingsStore';
import { ListItem, PurchaseItem } from '../../../stores/listsStore';
import ListItemPurchase from './list-item-purchase.vue'
import { getIdsSortedAccordingToChecked, sortPurchasesWithIdsArray } from '../../../utils/common';
import { SORT_TIMEOUT } from '../../../utils/constants';

const listsStore = useListsStore()
const settingsStore = useSettingsStore()
const { list } = defineProps<Props>()

// PURCHASES SORTING

const listIdx = computed(() => listsStore.lists.findIndex(l => l.id === list.id))
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

const startReorderTimer = () => {
  const currentSortedIds = sortedIds
  let newSortedIds = getIdsSortedAccordingToChecked(currentListItems.value)
  let orderWasChanged = false

  newSortedIds.forEach((nsi, nsiIdx) => {
    if (currentSortedIds.value[nsiIdx] !== nsi) {
      orderWasChanged = true
    }
  })

  if (orderWasChanged) {
    clearTimeout(sortDelayTimer.value)
    sortDelayTimerStart.value = +new Date()
    sortDelayTimerEnd.value = sortDelayTimerStart.value + SORT_TIMEOUT

    sortDelayTimer.value = setTimeout(() => {
      // refresh sorted ids in case it have changed during timer's period
      newSortedIds = getIdsSortedAccordingToChecked(currentListItems.value)
      sortedIds.value = newSortedIds
    }, SORT_TIMEOUT);
  }
}

watch(currentListItems.value, startReorderTimer)

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
  listsStore.togglePurchasesCheck(list.id, [purchase])
  startReorderTimer()
}
const onDeletePurchase = (purchase: PurchaseItem) => {
  listsStore.deletePurchases(list.id, [purchase])
}

// HEADER, MINIMIZE

const isMinimized = computed({
  get() {
    const minimized = settingsStore.userSettings?.minimizedLists.includes(list.id)
    return minimized ? [] : [0]
  },

  set() {
    settingsStore.toggleMinimizeList(list.id)
  }
})

const itemsCountString = computed(() => {
  const count = list.items.length
  return `${count} ${count === 1 ? 'item' : 'items'}`
})

// LIST MENU

const openManagePurchasesDialog = () => {
  settingsStore.openPurchasesManageDialog(list.id)
}

const listMenuItems = [
  { name: 'Edit purchases', icon: null, onClick: openManagePurchasesDialog },
]

// TYPES

interface Props {
  list: ListItem
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
</style>
