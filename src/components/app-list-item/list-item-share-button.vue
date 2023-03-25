<template>
  <div
    @click.stop="openShareListDialog"
    class="list-item-title__toggle-menu"
  >
    <v-icon icon="mdi-account-multiple" />
    <v-tooltip
      activator="parent"
      location="bottom"
      open-delay="500"
    >
      {{ tooltipMessage }}
    </v-tooltip>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useListsStore } from '../../stores/listsStore';
import { useSettingsStore } from '../../stores/settingsStore';

const { listId } = defineProps<Props>()
const settingsStore = useSettingsStore()
const listsStore = useListsStore()

const list = listsStore.lists.find(l => l.id === listId)
const sharedUsers = list?.users.sharedUsers
const tooltipMessage = computed(() => {
  if (sharedUsers?.length === 1) {
    return `List shared with 1 user`
  }
  return `List shared with ${sharedUsers?.length} users`
})

const openShareListDialog = () => {
  settingsStore.openShareListDialog(listId)
}

interface Props {
  listId: string
}
</script>

<style>
</style>
