<script setup lang="ts">
import { nextTick, ref, unref } from 'vue';
import { AVAIL_COLORS } from '../../../utils/constants';
const colors = AVAIL_COLORS

const emit = defineEmits(['addNewList'])
const dialogIsOpen = ref(false)
const name = ref('')
const color = ref(colors[0])

const closeDialog = () => {
  dialogIsOpen.value = false
  name.value = ''
  color.value = colors[0]
}
const confirmAddList = () => {

  // ADD VALIDATION

  emit('addNewList', { name: unref(name), color: unref(color) })
  closeDialog()
}
</script>

<template>
  <div class="text-center">
    <v-dialog
      v-model="dialogIsOpen"
      width="400"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          color="primary"
          v-bind="props"
        >
          Add new list
        </v-btn>
      </template>

      <v-card>
        <v-card-text>
          <div class="manage-lists-item-center">
            <v-text-field
              v-model="name"
              density="compact"
              label="New list name"
            ></v-text-field>
            <v-select
              v-model="color"
              density="compact"
              label="New list color"
              :items="colors"
            ></v-select>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="closeDialog"
          >
            Back
          </v-btn>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="confirmAddList"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>

</style>
