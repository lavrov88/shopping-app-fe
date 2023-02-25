<script setup lang="ts">
import { ref } from 'vue';
import { AVAIL_COLORS } from '../../../utils/constants';
const colors = AVAIL_COLORS

const { data } = defineProps(['data'])
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
</script>

<template>
  <div class="manage-lists-item" :class="{ 'to-delete': data.toDelete }">
    <v-card>
      <v-card-text>
        <div class="manage-lists-item-inner">
          <div class="manage-lists-item-left">
            <v-icon icon="mdi-swap-vertical" />
        </div>
        <div class="manage-lists-item-center">
          <v-text-field
            @update:modelValue="onChangeName"
            v-model="nameModel"
            :disabled="data.toDelete"
            class="manage-lists-item-input"
            density="compact"
            label="List name"
          ></v-text-field>
          <v-select
            @update:modelValue="onChangeColor"
            v-model="colorModel"
            :disabled="data.toDelete"
            class="manage-lists-item-input"
            density="compact"
            label="List color"
            :items="colors"
          ></v-select>
        </div>
        <div class="manage-lists-item-right">
          <v-btn
            @click="onDelete"
            class="manage-lists-item_delete_btn"
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

<style scoped>
.manage-lists-item {
  margin-bottom: 10px;
}
.manage-lists-item.to-delete {
  opacity: 0.9;
}

.manage-lists-item-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.manage-lists-item-left {
  height: 100%;
  cursor: grab;
}
.manage-lists-item-center {
  flex-grow: 1;
}
.manage-lists-item_delete_btn {
  transition: all 0.3s ease;
}
.manage-lists-item.to-delete .manage-lists-item_delete_btn {
  scale: 6;
  opacity: 0.6;
}
</style>
