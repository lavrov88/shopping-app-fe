<template>
    <div class="app-main-bottom">
      <v-dialog
        v-model="dialog"
        width="auto"
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

        <v-card class="add-new-popup" width="450">
          <v-card-text>
            <div class="add-new-popup__head_prompt">
              Enter a list of new products, then select the list to add them to.
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
            <div class="add-new-popup__bottom">
              <v-btn
                color="blue"
                variant="outlined"
                block
                @click="dialog = false"
              >
                Back to lists
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useListsStore } from '../../stores/listsStore';
const listsStore = useListsStore()

const lists = computed(() => listsStore.sortedLists)
const dialog = ref(false)
const inputValue = ref('')
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

<style scoped>
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
.add-new-popup__bottom{
  margin-bottom: 10px;
}
</style>
