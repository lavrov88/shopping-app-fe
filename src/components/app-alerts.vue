<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useSettingsStore } from '../stores/settingsStore';

const settingsStore = useSettingsStore()
const alertsToShow = computed(() => settingsStore.alertsToShow)
const alert = reactive({ show: false, text: '', type: 'error' })
const getAlertColor = (alertType: string) => {
  switch (alertType) {
    case 'error':
      return 'red-darken-4'
    case 'info':
      return 'blue-lighten-4'
    case 'success':
      return 'green-lighten-1'

    default:
      return 'red-darken-4'
  }
}

watch(alertsToShow, (newValue) => {
  if (!newValue.length) {
    return
  }

  const { message, id, type } = alertsToShow.value[0]
  alert.text = message
  alert.type = type
  alert.show = true
  settingsStore.removeAlert(id)
})
</script>

<template>
  <v-snackbar
    v-model="alert.show"
    location="top"
    :color="getAlertColor(alert.type)"
    :timeout="4000"
  >
    <div class="alert-inner">
      <v-icon v-if="alert.type === 'error'" icon="mdi-alert-circle-outline" />
      <v-icon v-if="alert.type === 'info'" icon="mdi-bell-ring" />
      <v-icon v-if="alert.type === 'success'" icon="mdi-check-bold" />

      <span>{{ alert.text }}</span>
    </div>
  </v-snackbar>
</template>

<style scoped>
.alert-inner {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}
</style>