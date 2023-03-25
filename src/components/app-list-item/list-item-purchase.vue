<template>
  <v-btn
    @click="$emit('toggleChecked', { ...purchase, checked: !purchase.checked })"
    @contextmenu="onContextMenu"
    :variant="purchase.checked ? 'tonal' : 'flat'"
    rounded="lg"
    :color="color"
    class="purchases-list-item"
  >
    <span
      :class="[
        'purchase-list-item__name',
        { checked: purchase.checked }
      ]"
    >
      {{ purchase.name }}
    </span>
    <v-dialog
      v-model="menuIsOpen"
      width="auto"
      :close-on-content-click="true"
    >
      <v-card>
        <template #title>
          <div class="purchase-menu-title" :style="`color: ${optionsTitleColor}`">
            {{ purchase.name }}
          </div>
        </template>

        <template #text>
          <v-divider />
          <v-list class="purchase-menu-items">

            <v-list-item
              @click="onMoveOpen"
              title="Move to another list"
              class="purchase-menu-item"
              prepend-icon="mdi-arrow-right-top"
            />
            <v-list-item
              @click="onRenameOpen"
              title="Rename"
              class="purchase-menu-item"
              prepend-icon="mdi-rename"
            />
            <v-list-item
              @click="onDeleteClicked"
              title="Delete"
              class="purchase-menu-item"
              prepend-icon="mdi-delete-outline"
            >
            </v-list-item>
          </v-list>
        </template>
      </v-card>
    </v-dialog>

    <!-- MOVE -->

    <v-dialog
      v-model="moveDialogIsOpen"
      :max-width="400"
      :width="300"
    >
      <v-card
        title="Move"
        subtitle="Choose a list to move in"
      >
        <template v-slot:text>
          <div class="purchase-move-inner">
            <v-btn
              v-for="list in availableLists"
              :key="list.id"
              @click="onMoveListClicked(list.id)"
              :color="list.color"
              class="purchase-move-list-item"
              block
            >
              {{ list.name }}
            </v-btn>
          </div>
          <footer-buttons
            @cancel="moveDialogIsOpen = false"
            back-btn-text="Cancel"
          />
        </template>

      </v-card>
    </v-dialog>

    <!-- RENAME -->

    <v-dialog
      v-model="renameDialogIsOpen"
      width="auto"
      :max-width="400"
    >
      <v-card
        title="Rename"
      >
        <template v-slot:text>
          <div class="purchase-rename-inner">
            <v-text-field
              v-model="renameValue"
              ref="renameTextField"
            />
          </div>
          <footer-buttons
            @cancel="renameDialogIsOpen = false"
            @confirm="onRenameConfirm"
            :has-confirm-btn="true"
            back-btn-text="Cancel"
          />
        </template>

      </v-card>
    </v-dialog>

    <!-- DELETE -->

    <dialog-confirm
      @confirm="onConfimDelete"
      @cancel="deleteConfirmationIsOpen = false"
      :is-open="deleteConfirmationIsOpen"
      confirm-btn-style="red"
      title="Delete"
    >
      <span class="delete-confirm-purchase-name">{{ purchase.name }}</span>
      is not checked.
      Are you sure you want to delete it?
    </dialog-confirm>

  </v-btn>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ListItem, PurchaseItem, useListsStore } from '../../stores/listsStore'
import { ColorsType, COLOR_OPTIONS } from '../../utils/constants'
import DialogConfirm from '../app-dialogs/dialog-confirm.vue'
import FooterButtons from '../common/footer-buttons.vue'

const { purchaseId, color, listId } = defineProps<Props>()
const emit = defineEmits(['toggleChecked', 'renameItem', 'deleteItem'])
const listsStore = useListsStore()
const list = computed(() => listsStore.lists.find(l => l.id === listId))
const purchase = computed(() => list.value?.items.find(p => p.id === purchaseId) as PurchaseItem)

// MENU

const menuIsOpen = ref(false)
const onContextMenu = (e: Event) => {
  e.preventDefault()
  menuIsOpen.value = true
}

const optionsTitleColor = computed(() => {
  const colorName = color.toLocaleUpperCase() as ColorsType
  return COLOR_OPTIONS[colorName].darken
})


// MOVE

const availableLists = computed(() => {
    return listsStore.sortedLists.filter(l => l.id !== listId) as ListItem[]
  })
const moveDialogIsOpen = ref(false)

const onMoveOpen = () => {
  moveDialogIsOpen.value = true
}
const onMoveListClicked = (newListId: string) => {
  moveDialogIsOpen.value = false
  listsStore.moveToAnotherList(listId, purchase.value, newListId)
}


// RENAME

const renameDialogIsOpen = ref(false)
const renameValue = ref(purchase.value.name)
const renameTextField = ref<any>(null)

const onRenameOpen = async () => {
  renameValue.value = purchase.value.name
  renameDialogIsOpen.value = true

  setTimeout(() => {
    renameTextField.value.select()
  }, 0);
}

const onRenameConfirm = () => {
  emit('renameItem', { purchase: purchase.value, name: renameValue.value })
  renameDialogIsOpen.value = false
}

// DELETE

const deleteConfirmationIsOpen = ref(false)
const onDeleteClicked = () => {
  if (!purchase.value.checked) {
    deleteConfirmationIsOpen.value = true
  } else {
    emit('deleteItem', purchase)
  }
}
const onConfimDelete = () => {
  deleteConfirmationIsOpen.value = false
  emit('deleteItem', purchase)
}


// TYPES

interface Props {
  purchaseId: string,
  color: string,
  listId: string,
}
</script>

<style>
.purchases-list-item {
  display: block;
  flex-grow: 1;
}
.purchases-list-item__text {
  margin: auto;
}
.purchase-list-item__name.checked {
  text-decoration: line-through;
}
.purchase-menu-title {
  padding-left: 15px;
  text-transform: capitalize;
  color: #858585;
}
.purchase-menu-items {
  margin-left: -20px;
  margin-right: -20px;
}
.purchase-menu-item {
  padding-left: 20px !important;
  padding-right: 20px !important;
}
.purchase-menu-item .v-list-item__prepend {
  width: 45px;
}
.purchase-move-list-item {
  margin-bottom: 10px;
}
.delete-confirm-purchase-name {
  font-weight: 700;
  text-transform: capitalize;
}
</style>
