<template>
  <v-dialog
    v-model="dialogIsOpen"
    width="auto"
    :max-width="400"
  >
    <v-card
      :title="props.title"
    >
      <template v-slot:text>
        <div class="confirmation-popup__text">
          <slot>
            Are you sure?
          </slot>
        </div>

        <footer-buttons
          @confirm="emit('confirm')"
          @cancel="emit('cancel')"
          :has-confirm-btn="true"
          :confirm-btn-style="confirmBtnStyle"
          back-btn-text="Cancel"
        />
      </template>

    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import FooterButtons from '../common/footer-buttons.vue';

const props = defineProps<ConfirmDialogProps>()
const emit = defineEmits([ 'confirm', 'cancel' ])

const dialogIsOpen = computed({
  get() {
    return props.isOpen
  },
  set(value) {
    if (!value) {
      emit('cancel')
    }
  }
})

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  confirmBtnStyle?: 'red' | 'green'
  confirmBtnText?: string
  cancelBtnText?: string
}
</script>

<style>
</style>
