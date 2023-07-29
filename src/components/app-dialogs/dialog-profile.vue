<template>
  <v-dialog
    v-model="dialogIsOpen"
    width="450"
  >
    <v-card
      title="Profile"
      :subtitle="username"
    >
      <v-card-text>
        <div class="profile-dialog-inner">

          <!-- CHANGE PASSWORD -->
          <v-btn
            @click="onClickOpenChangePasswordDialog"
            color="blue"
            block
          >
            Change password
          </v-btn>
          <v-dialog
            v-model="changePasswordPopupIsOpen"
            :width="400"
          >
            <v-card
              title="Change password"
              subtitle="Enter old and new passwords"
            >
              <template v-slot:text>
                <div class="profile-dialog-change-password-inner">
                  <v-text-field
                    v-model="oldPassword"
                    :rules="[ required, hasLengthCreator(6, 10) ]"
                    validate-on="blur"
                    label="Old password"
                    type="password"
                    ref="oldPasswordField"
                  ></v-text-field>
                  <v-text-field
                    v-model="newPassword"
                    :rules="[
                      required,
                      hasLengthCreator(6, 10),
                      notMatchesValueCreator(newPasswordErrorMessage)(oldPassword, newPassword)
                    ]"
                    validate-on="blur"
                    label="New password"
                    type="password"
                    ref="newPasswordField"
                    @blur="updatePasswordRepeatValidation"
                  ></v-text-field>
                  <v-text-field
                    v-model="newPasswordRepeat"
                    :rules="[
                      required,
                      matchesValueCreator(passwordRepeatErrorMessage)(newPasswordRepeat, newPassword)
                    ]"
                    validate-on="blur"
                    label="Repeat new password"
                    type="password"
                    ref="newPasswordRepeatField"
                  ></v-text-field>

                  <v-btn
                    @click="onClickConfirmChangePassword"
                    :loading="isFetchingPasswordChange"
                    :disabled="isFetchingPasswordChange"
                    color="blue"
                    block
                  >
                    Confirm change
                  </v-btn>
                </div>
                <footer-buttons
                  @cancel="changePasswordPopupIsOpen = false"
                  back-btn-text="Cancel"
                />
              </template>

            </v-card>
          </v-dialog>

          <!-- LOGOUT -->

          <v-btn
            @click="onLogoutClick"
            color="red"
            block
          >
            Logout
          </v-btn>

          <footer-buttons
            @cancel="dialogIsOpen = false"
            back-btn-text="Back"
          />
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSettingsStore } from '../../stores/settingsStore'
import {
  required,
  hasLengthCreator,
  matchesValueCreator,
  notMatchesValueCreator
} from '../../utils/validators'
import FooterButtons from '../common/footer-buttons.vue'

const settingsStore = useSettingsStore()
const username = computed(() => settingsStore.user?.username)

// CHANGE PASSWORD

const changePasswordPopupIsOpen = ref(false)
const oldPassword = ref('')
const newPassword = ref('')
const newPasswordRepeat = ref('')
const passwordRepeatErrorMessage = 'Entered passwords are different'
const newPasswordErrorMessage = 'New password should be different from old one'
const oldPasswordField = ref<any>(null)
const newPasswordField = ref<any>(null)
const newPasswordRepeatField = ref<any>(null)
const isFetchingPasswordChange = ref(false)

const onClickOpenChangePasswordDialog = () => {
  oldPassword.value = ''
  newPassword.value = ''
  newPasswordRepeat.value = ''
  changePasswordPopupIsOpen.value = true
}
const updatePasswordRepeatValidation = () => {
  if (newPasswordRepeat.value) {
    newPasswordRepeatField.value.validate()
  }
}
const checkAreFieldsValid = async () => {
  const oldPasswordErrors = await oldPasswordField.value.validate()
  const newPasswordErrors = await newPasswordField.value.validate()
  const newPasswordRepeatErrors = await newPasswordRepeatField.value.validate()
  const allAreValid = !([
    ...oldPasswordErrors,
    ...newPasswordErrors,
    ...newPasswordRepeatErrors
  ].length)

  return allAreValid
}
const onClickConfirmChangePassword = async () => {
  const fieldsAreValid = await checkAreFieldsValid()
  if (!fieldsAreValid) {
    return
  }

  isFetchingPasswordChange.value = true
  const passwordChangeResult = await settingsStore.changePassword(oldPassword.value, newPassword.value)
  isFetchingPasswordChange.value = false

  if (passwordChangeResult === true) {
    settingsStore.addAlert('Password successfully changed', 'success')
    changePasswordPopupIsOpen.value = false
  } else {
    const alertMessage = passwordChangeResult || 'Password change failed'
    settingsStore.addAlert(alertMessage)
  }
}

// LOGOUT

const onLogoutClick = () => {
  settingsStore.logout()
  dialogIsOpen.value = false
}

// OPEN-CLOSE DIALOG

const dialogIsOpen = computed({
  get: () => settingsStore.profileDialogIsOpen,
  set: () => settingsStore.profileDialogIsOpen = !settingsStore.profileDialogIsOpen,
})
</script>

<style>
.profile-dialog-inner {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
