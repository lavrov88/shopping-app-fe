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
              label="Username"
              ref="usernameField"
            ></v-text-field>

            <v-text-field
              v-model="password"
              :rules="[ required, hasLengthCreator(6, 10) ]"
              validate-on="blur"
              label="Password"
              type="password"
              ref="passwordField"
              @blur="updatePasswordRepeatValidation"
            ></v-text-field>

            <v-text-field
              v-model="passwordRepeat"
              :rules="[
                required,
                matchesValueCreator(passwordRepeatErrorMessage)(passwordRepeat, password)
              ]"
              validate-on="blur"
              label="Repeat password"
              type="password"
              ref="passwordRepeatField"
            ></v-text-field>

            <v-btn
              @click="onRegisterClick"
              color="light-blue-darken-4"
              rounded="lg"
              :loading="loading"
              :disabled="loading"
            >
              Register
            </v-btn>

            <v-btn
              @click="$emit('toggle-to-login')"
              color="light-blue-darken-4"
              variant="plain"
              rounded="lg"
              :disabled="loading"
            >
              Back to login
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
import { onMounted } from 'vue';
import { onUnmounted } from 'vue';
import { required, hasLengthCreator, matchesValueCreator } from '../utils/validators';

const emit = defineEmits([ 'toggle-to-login' ])
const settingsStore = useSettingsStore()
const { register, addAlert } = settingsStore

const username = ref('')
const password = ref('')
const passwordRepeat = ref('')
const loading = ref(false)

// VALIDATION

const usernameField = ref<any>(null)
const passwordField = ref<any>(null)
const passwordRepeatField = ref<any>(null)
const passwordRepeatErrorMessage = 'Entered passwords are different'

const checkAreFieldsValid = async () => {
  const usernameErrors = await usernameField.value.validate()
  const passwordErrors = await passwordField.value.validate()
  const passwordRepeatErrors = await passwordRepeatField.value.validate()

  return !([ ...usernameErrors, ...passwordErrors, ...passwordRepeatErrors ].length)
}

const updatePasswordRepeatValidation = () => {
  if (passwordRepeat.value) {
    passwordRepeatField.value.validate()
  }
}

// REGISTER

const onRegisterClick = async () => {
  const fieldsAreValid = await checkAreFieldsValid()
  if (!fieldsAreValid) {
    return
  }

  loading.value = true
  const registerResult = await register(username.value, password.value)
  loading.value = false

  if (registerResult) {
    addAlert('Registered successfully. Now you can login with this credentials.', 'success')
    emit('toggle-to-login')
  } else {
    addAlert('Registration failed')
  }
}

const registerKeydownHandler = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    onRegisterClick()
  }
}
onMounted(() => {
  window.addEventListener('keydown', registerKeydownHandler)
})
onUnmounted(() => {
  window.removeEventListener('keydown', registerKeydownHandler)
})

</script>

<style>
</style>
