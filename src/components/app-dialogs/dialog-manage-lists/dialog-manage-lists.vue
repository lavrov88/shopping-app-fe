<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import draggable from 'vuedraggable'
import { useSettingsStore } from '../../../stores/settingsStore'
import { useListsStore } from '../../../stores/listsStore';
import ManageListsItem from './manage-lists-item.vue'
import ManageListsAddNew from './manage-lists-add-new.vue';
import { getRandom } from '../../../utils/common';
const settingsStore = useSettingsStore()
const listsStore = useListsStore()

const revertTemporaryLists = () => {
  temporaryLists = reactive(originalLists.value.map(l => {
    return {
      id: l.id,
      name: l.name,
      color: l.color,
      toDelete: false,
    }
  }))
}

// OPEN AND CLOSE DIALOG

const dialogIsOpen = computed(() => settingsStore.listsManageDialogIsOpen)
const onDialogClose = () => {
  revertTemporaryLists()
  settingsStore.listsManageDialogIsOpen = false
}

// EDIT

const originalLists = computed(() => listsStore.lists)
let temporaryLists = reactive(originalLists.value.map(l => {
  return {
    id: l.id,
    name: l.name,
    color: l.color,
    toDelete: false,
  }
}))

const onItemNameChange = (payload: { id: string, name: string }) => {
  const listIdx = temporaryLists.findIndex(l => l.id === payload.id)
  if (listIdx > -1) {
    temporaryLists[listIdx] = { ...temporaryLists[listIdx], name: payload.name }
  }
}
const onItemColorChange = (payload: { id: string, color: string }) => {
  const listIdx = temporaryLists.findIndex(l => l.id === payload.id)
  if (listIdx > -1) {
    temporaryLists[listIdx] = { ...temporaryLists[listIdx], color: payload.color }
  }
}

// ADD NEW LIST

const onAddNewList = (payload: {name: string, color: string}) => {
  const { name, color } = payload
  temporaryLists.push({
    id: getRandom(),
    name,
    color,
    toDelete: false
  })
}

// DELETE

const onItemDelete = (payload: { id: string, value: boolean }) => {
  const listIdx = temporaryLists.findIndex(l => l.id === payload.id)

  if (listIdx > -1) {
    temporaryLists[listIdx] = {
      ...temporaryLists[listIdx],
      toDelete: !temporaryLists[listIdx].toDelete
    }
  }
}

// DRAG AND DROP

const dragging = ref(false)

// ACCEPT

const onAcceptListsEdit = () => {
  listsStore.updateListsChanges(temporaryLists)
  onDialogClose()
}

// WATCHER

watch(originalLists, revertTemporaryLists)

</script>

<template>
  <v-dialog
    v-model="dialogIsOpen"
    width="450"
  >
    <v-card>
      <v-card-text>
        <div class="manage-lists-header">
          <h3>Manage lists</h3>
        </div>

        <draggable
          :list="temporaryLists"
          item-key="id"
          class="manage-lists-main"
          handle=".manage-lists-item-left"
          ghost-class="ghost"
          @start="dragging = true"
          @end="dragging = false"
        >
          <template #item="{ element }">
              <manage-lists-item
                @name-changed="onItemNameChange"
                @color-changed="onItemColorChange"
                @delete="onItemDelete"
                :data="element"
              />
          </template>
        </draggable>

        <div class="manage-lists-footer">
          <manage-lists-add-new @add-new-list="onAddNewList" />
          <v-btn @click="onAcceptListsEdit" block class="mt-2">
            Accept
          </v-btn>
          <v-btn color="primary" block @click="onDialogClose">
            Back
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.not-draggable {
  cursor: no-drop;
}
</style>
