<template>
  <v-dialog
    v-model="dialogIsOpen"
    width="450"
    class="dialog-manage-purchases"
  >
    <v-card
      :title="list?.name"
      subtitle="List editing"
    >
      <v-card-text>
        <draggable
          :list="temporaryPurchases"
          item-key="id"
          class="manage-purchases-main"
          handle=".editable-item-left"
          ghost-class="ghost"
          @start="dragging = true"
          @end="dragging = false"
        >
          <template #item="{ element }">
            <editable-item
              @name-changed="onItemNameChange"
              @delete="onItemDelete"
              :data="element"
              :color="list?.color || ''"
              itemType="purchase"
            />
          </template>
        </draggable>

        <footer-buttons
          @cancel="onDialogClose"
          @confirm="onAccept"
          :has-confirm-btn="true"
          confirm-btn-text="Accept"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import draggable from 'vuedraggable'
import { PurchaseItem, useListsStore } from '../../../stores/listsStore'
import { useSettingsStore } from '../../../stores/settingsStore'
import FooterButtons from '../../common/footer-buttons.vue'
import EditableItem from '../dialog-manage-lists/editable-item.vue'

const settingsStore = useSettingsStore()
const listsStore = useListsStore()

const mapPurchaseToEdititem = (p: PurchaseItem) => {
  return {
    name: p.name,
    id: p.id,
    checked: p.checked,
    sortRate: p.sortRate,
    toDelete: false,
  }
}

const listId = computed(() => settingsStore.purchasesManageDialog.listId)
const list = computed(() => listsStore.sortedLists.find(l => l.id === listId.value))
const originalPurchases = computed(() => list.value ? list.value.items : [])
let temporaryPurchases = reactive(originalPurchases.value.map(mapPurchaseToEdititem))

const revertTemporaryPurchases = () => {
  temporaryPurchases = reactive(originalPurchases.value.map(mapPurchaseToEdititem))
}

// RENAME

const onItemNameChange = (payload: { id: string, name: string }) => {
  const purchaseIdx = temporaryPurchases.findIndex(p => p.id === payload.id)
  if (purchaseIdx > -1) {
    temporaryPurchases[purchaseIdx] = { ...temporaryPurchases[purchaseIdx], name: payload.name }
  }
}

// DELETE

const onItemDelete = (payload: { id: string, value: boolean }) => {
  const purchaseIdx = temporaryPurchases.findIndex(p => p.id === payload.id)

  if (purchaseIdx > -1) {
    temporaryPurchases[purchaseIdx] = {
      ...temporaryPurchases[purchaseIdx],
      toDelete: !temporaryPurchases[purchaseIdx].toDelete
    }
  }
}

// DRAG AND DROP

const dragging = ref(false)
const updateSortOrder = () => {
  const originalOrder = originalPurchases.value.map(op => op.id)
  const newOrder = temporaryPurchases.map(tp => tp.id)
  let orderWasChanged = false

  newOrder.forEach((id, idx) => {
    if (id !== originalOrder[idx]) {
      orderWasChanged = true
    }
  })

  if (orderWasChanged) {
    temporaryPurchases = temporaryPurchases.map((tp, idx) => {
      return { ...tp, sortRate: idx + 1 }
    })
  }
}

// OPEN-CLOSE DIALOG

const dialogIsOpen = computed({
  get: () => settingsStore.purchasesManageDialog.isOpen,
  set: () => onDialogClose(),
})

const onDialogClose = () => {
  settingsStore.closePurchasesManageDialog()
}
const onAccept = async () => {
  const id = listId.value
  updateSortOrder()
  onDialogClose()
  listsStore.updatePurchasesChanges(temporaryPurchases, id as string)
}

// WATCHERS

watch(dialogIsOpen, () => {
  if (dialogIsOpen.value) {
    revertTemporaryPurchases()
  }
})
</script>

<style>
.manage-purchases-main {
  margin-top: 10px;
  margin-bottom: 30px;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.not-draggable {
  cursor: no-drop;
}

/* MOBILE */

@media (max-width: 600px) {
  .dialog-manage-purchases > .v-overlay__content {
    max-width: calc(100vw - 10px) !important;
  }
}
</style>
