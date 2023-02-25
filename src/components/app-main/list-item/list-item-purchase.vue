<script setup lang="ts">
import { PurchaseItem } from '../../../stores/listsStore';

interface Props {
  purchase: PurchaseItem,
  color: string
}
const { purchase, color } = defineProps<Props>()
const emit = defineEmits(['toggleChecked', 'deleteItem'])

const onContextMenu = (e: Event) => {
  e.preventDefault()
  console.log('RIGHT CLICK')
  emit('deleteItem', purchase)
}
</script>

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
  </v-btn>
</template>

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
</style>
