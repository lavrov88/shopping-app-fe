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
            <strong>Add new goods</strong>
          </v-btn>
        </template>

        <v-card class="add-new-popup" :width="dialogCardWidth">
          <v-card-text>
            <div class="add-new-popup__head_prompt">
              Enter new products, then select a list
            </div>
            <div class="add-new-popup__input">
              <v-textarea
                v-model:model-value="inputValue"
                label="New products separated by commas"
                rows="2"
                variant="filled"
                auto-grow
                clearable
              >
              </v-textarea>
            </div>
            <div class="add-new-popup__lists_buttons">
              <v-btn
                v-for="list in lists"
                :key="list.id"
                @click="onAddNewPurchases(list.id, newPurchases)"
                :color="list.color"
                class="add-new-popup__lists_button_item"
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

const settingsStore = useSettingsStore()
const listsStore = useListsStore()
const lists = computed(() => listsStore.sortedLists)
const dialog = ref(false)
const inputValue = ref('')
const mobileLayout = computed(() => settingsStore.mobileLayout)
const dialogWidth = computed(() => mobileLayout.value ? '100%' : 'auto')
const dialogCardWidth = computed(() => mobileLayout.value ? '100%' : '450')
const newPurchases = computed(() => {
  return inputValue.value.split(',').map(i => i.trim())
})

const onAddNewPurchases = async (listId: string, newPurchases: string[]) => {
  dialog.value = false
  try {
    await listsStore.addNewPurchases(listId, newPurchases)
    inputValue.value = ''
  } catch (e) {
    // alert error
  }
}
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
.add-new-popup__head_prompt {
  margin-bottom: 10px;
  font-size: 11px;
  color: #757575;
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
    height: 50px;
    padding: 5px;
    z-index: 100;
    background-color: #eee;
    box-shadow: 0px -4px 4px 0px #eee;
  }
  .dialog-add-purchases > .v-overlay__content {
    max-width: calc(100% - 10px);
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
