<template>
  <div class="editable-item" :class="{ 'to-delete': data.toDelete }">
    <v-card>
      <v-card-text>
        <div class="editable-item-inner">
          <div class="editable-item-left">
            <v-icon icon="mdi-swap-vertical" />
        </div>
        <div class="editable-item-center">
          <v-text-field
            @update:modelValue="onChangeName"
            v-model="nameModel"
            :disabled="data.toDelete"
            class="editable-item-input"
            :class="data.checked ? 'checked' : ''"
            density="compact"
            :label="colorModel ? 'List name' : ''"
          ></v-text-field>
          <v-select
            v-if="colorModel"
            @update:modelValue="onChangeColor"
            v-model="colorModel"
            :disabled="data.toDelete"
            class="editable-item-select"
            density="compact"
            label="List color"
            :items="colors"
          ></v-select>
        </div>
        <div class="editable-item-right">
          <v-btn
            @click="onDelete"
            class="editable-item_delete_btn"
            color="red"
            icon="mdi-delete-outline"
            :variant="data.toDelete ? 'flat' : 'outlined'"
            size="x-small"
          ></v-btn>
        </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { AVAIL_COLORS } from '../../../utils/constants';
const colors = AVAIL_COLORS

const { data } = defineProps<EditableItemProps>()
const emits = defineEmits(['nameChanged', 'colorChanged', 'delete'])
const nameModel = ref(data.name)
const colorModel = ref(data.color)

const onChangeName = (newValue: string) => {
  emits('nameChanged', { id: data.id, name: newValue })
}
const onChangeColor = (newValue: string) => {
  emits('colorChanged', { id: data.id, color: newValue })
}
const onDelete = () => {
  emits('delete', { id: data.id, value: !data.toDelete })
}

interface EditableItemProps {
  data: {
    name: string
    id: string
    toDelete: boolean
    color?: string // only for list item
    checked?: boolean // only for purchase item
    sortRate?: number // only for purchase item
  }
}
</script>

<style scoped>
.editable-item {
  margin-bottom: 10px;
}
.editable-item-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.editable-item-left {
  height: 100%;
  cursor: grab;
}
.editable-item-center {
  flex-grow: 1;
}
.editable-item_delete_btn {
  transition: all 0.3s ease;
}
.editable-item.to-delete .editable-item_delete_btn {
  scale: 6;
  opacity: 0.6;
}
</style>

<style>
.editable-item-input.checked .v-field__input {
  text-decoration: line-through;
}
</style>
