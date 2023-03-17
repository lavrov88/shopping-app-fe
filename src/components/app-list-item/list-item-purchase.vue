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
          <div class="purchase-confirmation-popup__text">
            <v-btn
              v-for="list in availableLists"
              :key="list.id"
              @click="onMoveListClicked(list.id)"
              :color="list.color"
              class="purchase-confirmation-popup__move_btn"
              block
            >
              {{ list.name }}
            </v-btn>
          </div>

          <div class="purchase-confirmation-popup__footer">
            <v-btn
              @click="moveDialogIsOpen = false"
              variant="outlined"
              color="blue"
              block
            >
              Cancel
            </v-btn>
          </div>
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
          <div class="purchase-confirmation-popup__text">
            <v-text-field
              v-model="renameValue"
              ref="renameTextField"
            />
          </div>

          <div class="purchase-confirmation-popup__footer">
            <v-btn
              @click="onRenameConfirm"
              color="blue"
              style="width: 48%;"
            >
              Confirm
            </v-btn>
            <v-btn
              @click="renameDialogIsOpen = false"
              variant="outlined"
              color="blue"
              style="width: 48%;"
            >
              Cancel
            </v-btn>
          </div>
        </template>

      </v-card>
    </v-dialog>

    <!-- DELETE -->

    <v-dialog
      v-model="deleteConfirmationIsOpen"
      width="auto"
      :max-width="400"
    >
      <v-card
        title="Delete"
      >
        <template v-slot:text>
          <div class="purchase-confirmation-popup__text">
            <span>{{ purchase.name }}</span> is not checked. Are you sure you want to delete it?
          </div>

          <div class="purchase-confirmation-popup__footer">
            <v-btn
              @click="onConfimDelete"
              color="red-darken-2"
              style="width: 48%;"
            >
              Confirm
            </v-btn>
            <v-btn
              @click="deleteConfirmationIsOpen = false"
              variant="outlined"
              color="blue"
              style="width: 48%;"
            >
              Cancel
            </v-btn>
          </div>
        </template>

      </v-card>
    </v-dialog>

  </v-btn>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { ListItem, PurchaseItem, useListsStore } from '../../stores/listsStore';
import { ColorsType, COLOR_OPTIONS } from '../../utils/constants';

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

.purchase-confirmation-popup__text {
  color: #6c6c6c;
}

.purchase-confirmation-popup__text > span {
  font-weight: 700;
  text-transform: capitalize;
}

.purchase-confirmation-popup__footer {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.purchase-confirmation-popup__move_btn {
  margin-bottom: 10px;
}
</style>
