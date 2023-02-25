<script setup lang="ts">
import { computed, ref } from 'vue';
import { useSettingsStore } from '../../stores/settingsStore'
const settingsStore = useSettingsStore()

// OPEN DIALOG

const loginDialogIsOpen = computed(() => settingsStore.loginDialogIsOpen)
const onLoginDialogClose = () => {
  settingsStore.loginDialogIsOpen = false
}

// LOGIN

const username = ref('')
const password = ref('')
const loginInProgress = computed(() => settingsStore.loginInProgress)
const loginErrorSnackbar = ref(false)
const loginSubmit = async () => {
  const result = await settingsStore.login(username.value, password.value)
  if (result) {
    username.value = ''
    password.value = ''
    settingsStore.loginDialogIsOpen = false
  } else {
    loginErrorSnackbar.value = true
  }
}


</script>

<template>
  <v-dialog
    v-model="loginDialogIsOpen"
    width="450"
  >
    <v-card>
      <v-card-text>
        <v-form validate-on="submit" @submit.prevent="loginSubmit">
          <v-text-field
            v-model="username"
            label="User name"
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
          ></v-text-field>
          <v-btn
            type="submit"
            block
            class="mt-2"
            :loading="loginInProgress"
            :disabled="loginInProgress"
          >
            Submit
          </v-btn>
          <v-btn
            color="primary"
            block
            @click="onLoginDialogClose"
          >
            Back
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>

  
  <v-snackbar
    v-model="loginErrorSnackbar"
    :timeout="3000"
    vertical
  >
    <div class="text-subtitle-1 pb-2">Error</div>
    <p>Wrong username or password</p>
    <template v-slot:actions>
      <v-btn
        color="red"
        variant="tonal"
        @click="loginErrorSnackbar = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<style scoped>
</style>
