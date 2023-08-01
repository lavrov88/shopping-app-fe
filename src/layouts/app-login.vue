<template>
  <div class="login-layout">
    <div class="login-containter">
      <v-card
        class="login-card-wrapper"
        rounded="lg"
      >
        <template v-slot:text>
          <div class="login-card-inner">
            <h1 class="login-title">Smart shopping app</h1>

            <v-text-field
              v-model="username"
              :rules="[ required ]"
              validate-on="blur"
              label="Username"
              ref="usernameField"
            ></v-text-field>

            <v-text-field
              v-model="password"
              :rules="[ required, hasLengthCreator(6) ]"
              validate-on="blur"
              label="Password"
              type="password"
              ref="passwordField"
            ></v-text-field>

            <v-btn
              @click="onLoginClick"
              color="light-blue-darken-4"
              rounded="lg"
              :loading="loading"
              :disabled="loading"
            >
              Login
            </v-btn>
            <v-btn
              @click="$emit('toggle-to-register')"
              color="light-blue-darken-4"
              variant="plain"
              rounded="lg"
              :disabled="loading"
            >
              Not a user? Register
            </v-btn>
          </div>
        </template>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onMounted } from 'vue';
import { onUnmounted } from 'vue';
import { useSettingsStore } from '../stores/settingsStore';
import { required, hasLengthCreator } from '../utils/validators'

const settingsStore = useSettingsStore()
const { login, addAlert, initApp } = settingsStore

const username = ref('')
const password = ref('')
const loading = ref(false)

// VALIDATION

const usernameField = ref<any>(null)
const passwordField = ref<any>(null)
const checkAreFieldsValid = async () => {
  const usernameErrors = await usernameField.value.validate()
  const passwordErrors = await passwordField.value.validate()

  return !([ ...usernameErrors, ...passwordErrors ].length)
}

// LOGIN

const onLoginClick = async () => {
  const fieldsAreValid = await checkAreFieldsValid()
  if (!fieldsAreValid) {
    return
  }

  loading.value = true
  const loginResult = await login(username.value, password.value)
  loading.value = false

  if (loginResult) {
    addAlert('Logged successfully', 'success')
    settingsStore.appIsInitialized = false
    initApp()
  } else {
    addAlert('Wrong username or password')
  }
}

const loginKeydownHandler = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    onLoginClick()
  }
}
onMounted(() => {
  window.addEventListener('keydown', loginKeydownHandler)
})
onUnmounted(() => {
  window.removeEventListener('keydown', loginKeydownHandler)
})

</script>

<style>
.login-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
}

.login-containter {
  max-width: 500px;
}

.login-card-inner {
  display: flex;
  flex-direction: column;
  padding: 40px 60px;
}

.login-title {
  margin-bottom: 40px;
  text-align: center;
  font-weight: normal;
}

.login-card-inner button {
  margin-top: 20px;
}

.login-card-inner .v-checkbox {
  margin-top: 10px;
  margin-bottom: -20px;
}
.login-card-inner .v-input__control {
  justify-content: center;
}


/* MOBILE */

@media (max-width: 600px) {
  body {
    overflow-x: hidden;
  }
  .login-layout {
    align-items: start;
    overflow-x: hidden;
  }
  .login-containter {
    max-width: 100%;
    overflow-x: hidden;
  }

  .login-card-wrapper {
    width: 100%;
    overflow-x: hidden;
  }
}
</style>
