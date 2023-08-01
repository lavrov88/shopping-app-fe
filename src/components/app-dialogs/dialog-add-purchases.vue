<template>
    <div class="app-main-bottom">
      <v-dialog
        v-model="dialog"
        :width="dialogWidth"
        class="dialog-add-purchases"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            block
            prepend-icon="mdi-basket-plus-outline"
            color="light-blue-darken-4"
            rounded="lg"
          >
            <strong>Add purchases</strong>
          </v-btn>
        </template>

        <v-card
          class="add-new-popup"
          :width="dialogCardWidth"
        >
          <v-card-text>
            <div class="add-new-popup__input">
              <v-textarea
                v-model:model-value="inputValue"
                label="New purchases separated by commas"
                rows="2"
                variant="filled"
                auto-grow
                clearable
                ref="inputEl"
              >
              </v-textarea>
            </div>
            <div class="add-new-popup__lists_buttons">
              <v-btn
                v-for="list in lists"
                :key="list.id"
                :color="list.color"
                class="add-new-popup__lists_button_item"
                @click="onAddNewPurchases(list.id, newPurchases)"
              >
                {{ list.name }}
              </v-btn>
            </div>
            <footer-buttons
              @cancel="dialog = false"
              back-btn-text="Back to lists"
              class="add-new-popup__footer"
            />
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useListsStore } from '../../stores/listsStore'
import { useSettingsStore } from '../../stores/settingsStore'
import FooterButtons from '../common/footer-buttons.vue'
import { watch } from 'vue'
import { updateDialogHeight } from '../../utils/dialogs'

const settingsStore = useSettingsStore()
const listsStore = useListsStore()
const lists = computed(() => listsStore.sortedLists)
const dialog = ref(false)
const inputEl = ref<HTMLTextAreaElement | null>(null)
const inputValue = ref('')
const mobileLayout = computed(() => settingsStore.mobileLayout)
const availableWindowHeight = computed(() => settingsStore.availableWindowHeight)
const dialogWidth = computed(() => mobileLayout.value ? '100%' : 'auto')
const dialogCardWidth = computed(() => mobileLayout.value ? '100%' : '450')
const newPurchases = computed(() => {
  return inputValue.value.split(',').map(i => i.trim())
})

const onAddNewPurchases = async (listId: string, newPurchases: string[]) => {
  if (!inputValue.value.length) {
    settingsStore.addAlert(`You did not entered any purchases...`, 'warning')
    return
  }

  dialog.value = false
  try {
    await listsStore.addNewPurchases(listId, newPurchases)
    inputValue.value = ''
  } catch (e) {
    // alert error
  }
}

watch(dialog, () => {
  if (!dialog.value) {
    return
  }

  setTimeout(() => {
    if (inputEl.value) {
      inputEl.value.focus()
    }
  }, 0);
})

watch(availableWindowHeight, () => {
  updateDialogHeight(availableWindowHeight.value, 'dialog-add-purchases');
})
</script>

<style>
.app-main-bottom {
  position: absolute;
  bottom: 0;
  height: 80px;
  width: calc(100% - 40px);
  padding-top: 20px;
}
.add-new-popup {
  width: 550px;
}
.add-new-popup__input {
    margin-top: 5px;
  }
.add-new-popup__lists_buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 15px;
}
.add-new-popup__lists_button_item {
  flex-grow: 1;
}
.add-new-popup__footer {
  margin-bottom: 10px;
}

/* MOBILE */

@media (max-width: 600px) {
  .app-main-bottom {
    position: fixed;
    left: 0;
    width: calc(100% - 0px);
    height: 55px;
    padding: 5px;
    z-index: 100;
    background-color: #eee;
    box-shadow: 0px -4px 4px 0px #eee;
  }
  .app-main-bottom > button.v-btn {
    height: 44px;
  }
  .dialog-add-purchases.v-overlay {
    align-items: end;
  }
  .dialog-add-purchases > .v-overlay__content {
    max-width: calc(100% - 20px) !important;
  }
  .dialog-add-purchases .v-card-text {
    padding: 10px 10px 0 !important;
  }
  .add-new-popup__input .v-field-label,
  .add-new-popup__input .v-field__input {
    font-size: 0.9em;
  }
  .add-new-popup__input .v-field__input {
    padding-inline-start: 10px;
  }
  .add-new-popup__input .v-field-label.v-field-label--floating {
    font-size: 0.75em;
    margin-left: 10px;
  }
  .add-new-popup__lists_buttons {
    margin-bottom: 15px;
  }
  .add-new-popup__footer {
    margin-top: 15px;
  }
}
</style>
