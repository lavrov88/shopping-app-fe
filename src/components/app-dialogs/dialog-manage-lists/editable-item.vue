<template>
  <div class="editable-item" :class="{ 'to-delete': data.toDelete }">
    <v-card>
      <v-card-text
        :class="itemType === 'list' ? '' : 'editable-item-wrapper'"
        :style="{ 'background-color': backgroundColor }"
      >
        <div class="editable-item-inner">
          <div class="editable-item-left">
            <v-icon icon="mdi-swap-vertical" size="large" />
          </div>
          <div class="editable-item-center">
            <v-text-field
              @update:modelValue="onChangeName"
              v-model="nameModel"
              :disabled="data.toDelete"
              variant="outlined"
              class="editable-item-input"
              :class="data.checked ? 'checked' : ''"
              density="compact"
            ></v-text-field>
            <v-select
              v-if="colorModel"
              @update:modelValue="onChangeColor"
              v-model="colorModel"
              :disabled="data.toDelete"
              variant="underlined"
              class="editable-item-select"
              density="compact"
              :items="colors"
            >
              <template v-slot:selection="{ item }">
                <div
                  class="editable-item-select__color-selected"
                  :style="{ backgroundColor: getOptionColor(item.value) }"
                ></div>
              </template>
              <template v-slot:item="{ item, props }">
                <v-list-item
                  v-bind="props"
                  :key="item.value"
                >
                  <template v-slot:title>
                    <div
                      class="editable-item-select__color-select-item"
                      :style="{ backgroundColor: getOptionColor(item.value) }"
                    >
                    </div>
                  </template>
                </v-list-item>
              </template>
            </v-select>
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
import { computed, ref } from 'vue';
import { AVAIL_COLORS, ColorsType, COLOR_OPTIONS } from '../../../utils/constants';
const colors = AVAIL_COLORS

const { data, color, itemType } = defineProps<EditableItemProps>()
const emit = defineEmits(['nameChanged', 'colorChanged', 'delete'])
const nameModel = ref(data.name)
const colorModel = ref(data.color)

const backgroundColor = computed(() => {
  const currentColor = colorModel.value || color;
  const colorName = currentColor.toLocaleUpperCase() as ColorsType
  return COLOR_OPTIONS[colorName].lightest
})

const getOptionColor = (color: string) => {
  const colorName = color.toLocaleUpperCase() as ColorsType
  return COLOR_OPTIONS[colorName].darken
}

const onChangeName = (newValue: string) => {
  emit('nameChanged', { id: data.id, name: newValue })
}
const onChangeColor = (newValue: string) => {
  emit('colorChanged', { id: data.id, color: newValue })
}
const onDelete = () => {
  emit('delete', { id: data.id, value: !data.toDelete })
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
  color: string
  itemType: 'list' | 'purchase'
}
</script>

<style scoped>
.editable-item {
  margin-bottom: 10px;
}
.editable-item-wrapper {
  padding: 0.5rem 1rem;
}
.editable-item-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  height: 35px;
}
.editable-item-left {
  display: flex;
  align-items: center;
  height: 100%;
  cursor: grab;
}
.editable-item-center {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px
}
.editable-item-input {
  width: 70%;
}
.editable-item-select {
  padding-bottom: 10px;
}
.editable-item-select__color-selected {
  height: 25px;
  width: 25px;
  margin: 0 auto;
  margin-bottom: 5px;
  border-radius: 5px;
}
.editable-item-select__color-select-item {
  height: 25px;
  width: 90%;
  margin: 0 auto;
  margin-bottom: 5px;
  border-radius: 5px;
}
.editable-item_delete_btn {
  transition: all 0.3s ease;
}
.editable-item.to-delete .editable-item_delete_btn {
  scale: 4;
  opacity: 0.6;
}
</style>

<style>
.editable-item-center .v-input__details {
  display: none;
}
.editable-item-input .v-field__field {
  height: 35px;
}
.editable-item-input .v-field__input {
  min-height: 35px;
  height: 35px;
  justify-content: flex-end;
  padding-top: 0rem;
  padding-bottom: 0rem;
}
.editable-item-input.checked .v-field__input {
  text-decoration: line-through;
}
</style>
