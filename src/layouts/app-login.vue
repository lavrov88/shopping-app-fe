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
              label="Username"
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="Password"
              type="password"
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
          </div>
        </template>
      </v-card>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSettingsStore } from '../stores/settingsStore';

const settingsStore = useSettingsStore()
const { login, addAlert, initApp } = settingsStore

const username = ref('')
const password = ref('')
const loading = ref(false)

const onLoginClick = async () => {
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
  width: 500px;
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
</style>
