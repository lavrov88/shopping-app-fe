<template>
  <div
    class="footer-buttons"
    :class="props.class || ''"
  >

  <v-btn
    v-if="hasConfirmBtn"
    @click="emit('confirm')"
    :color="confirmColor"
    style="width: 48%;"
  >
    {{ props.confirmBtnText || 'Confirm' }}
  </v-btn>
  <v-btn
    @click="emit('cancel')"
    variant="outlined"
    color="blue"
    :style="hasConfirmBtn ? 'width: 48%;' : 'width: 100%;'"
  >
    {{ props.backBtnText || 'Back' }}
  </v-btn>

  </div>
</template>

<script setup lang="ts">import { computed } from 'vue';


const props = defineProps<Props>()
const emit = defineEmits([ 'confirm', 'cancel' ])

const confirmColor = computed(() => {
  if (props.confirmBtnStyle === 'red') {
    return 'red-darken-2'
  }
  if (props.confirmBtnStyle === 'green') {
    return 'green'
  }
  return 'blue'
})

interface Props {
  class?: string

  hasConfirmBtn?: boolean
  confirmBtnStyle?: 'red' | 'green'
  confirmBtnText?: string

  backBtnText?: string
}
</script>

<style>
.footer-buttons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
}
</style>