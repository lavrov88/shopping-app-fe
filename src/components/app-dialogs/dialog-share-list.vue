<template>
  <v-dialog
    v-model="dialogIsOpen"
    width="450"
  >
    <v-card
      :title="list?.name"
      :subtitle="subtitle"
    >
      <v-card-text>
        <div
          v-if="usersAreLoading || (users.length)"
          class="share-list-users"
        >
          <div
            v-if="usersAreLoading"
            class="share-list-users-loading"
          >
            <v-progress-circular
              :size="50"
              indeterminate
            />
          </div>
          <v-list>
            <v-list-item
              v-for="user in users"
              :key="user.id"
              :title="user.name"
              class="share-list-user-item"
              :rounded="true"
            >
              <template v-slot:prepend>
                <v-avatar color="grey-lighten-1">
                  <v-icon color="white">mdi-account</v-icon>
                </v-avatar>
              </template>

              <template v-slot:title>
                <div class="share-list-user-item-inner">
                  <span class="share-list-user-item-title">
                    {{ user.name }}
                  </span>
                  <v-btn
                    @click="onUserRemoveClick(user.id)"
                    :disabled="userRemoveIsInProgress"
                    :loading="userRemoveIsInProgress"
                    color="red"
                    prepend-icon="mdi-account-remove"
                  >Remove</v-btn>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </div>

        <v-divider />

        <div class="share-list-add-new">
          <p class="font-weight-light text-medium-emphasis">Add new user to share with</p>
          <div class="share-list-add-new-input-and-button">
            <v-text-field
              v-model="newUserLogin"
              :disabled="sharingIsInProrgess"
              label="Enter user's login"
              placeholder="Login"
              prepend-inner-icon="mdi-account"
            />
            <v-btn
              @click="onShareClick"
              :disabled="sharingIsInProrgess"
              :loading="sharingIsInProrgess"
              prepend-icon="mdi-account-plus"
              color="green"
            >
              Share
            </v-btn>
          </div>
        </div>

        <footer-buttons
          @cancel="onDialogClose"
        />
      </v-card-text>
    </v-card>
  </v-dialog>

  <dialog-confirm
    @confirm="onConfirmRemoveUser"
    @cancel="onCancelRemoveUser"
    :is-open="confirmDeleteDialogIsOpen"
    title="Remove user"
  >
    This user will no longer have access to the list. Are you sure?
  </dialog-confirm>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useListsStore } from '../../stores/listsStore'
import { useSettingsStore } from '../../stores/settingsStore'
import DialogConfirm from './dialog-confirm.vue'
import FooterButtons from '../common/footer-buttons.vue'

const settingsStore = useSettingsStore()
const listsStore = useListsStore()

const listId = computed(() => settingsStore.shareListDialog.listId)
const list = computed(() => listsStore.sortedLists.find(l => l.id === listId.value))

// TITLE

const subtitle = computed(() => {
  if (usersAreLoading.value) {
    return ``
  }

  const usersQty = users.value.length
  if (usersQty > 1) {
    return `This list is shared for ${usersQty} users`
  }
  if (usersQty === 1) {
    return `This list is shared for 1 user`
  }

  return `This list is not shared for anyone`
})

// SHARED WITH USERS LIST

const ids = computed(() => list.value?.users.sharedUsers)
const users = ref<UserWithName[]>([])
const usersAreLoading = ref(false)

const getUsers = async () => {
  if (!ids.value || !ids.value.length) {
    users.value = []
    return
  }

  usersAreLoading.value = true
  users.value = await settingsStore.getUserNames(ids.value)
  usersAreLoading.value = false
}

interface UserWithName {
  id: string
  name: string
}

// REMOVE USER

const confirmDeleteDialogIsOpen = ref(false)
const userIdToConfirmDelete = ref('')
const userRemoveIsInProgress = ref(false)

const onUserRemoveClick = (userId: string) => {
  userIdToConfirmDelete.value = userId
  confirmDeleteDialogIsOpen.value = true
}
const onConfirmRemoveUser = async () => {
  confirmDeleteDialogIsOpen.value = false
  userRemoveIsInProgress.value = true
  await listsStore.removeUserFromShared(listId.value || '', userIdToConfirmDelete.value)
  userRemoveIsInProgress.value = false
  getUsers()
}
const onCancelRemoveUser = () => {
  userIdToConfirmDelete.value = ''
  confirmDeleteDialogIsOpen.value = false
}

// ADD NEW SHARE

const newUserLogin = ref('')
const sharingIsInProrgess = ref(false)
const onShareClick = async () => {
  sharingIsInProrgess.value = true
  const shareResult = await listsStore.shareList({
    listId: listId.value as string,
    username: newUserLogin.value
  })

  if (shareResult) {
    newUserLogin.value = ''
    users.value = []
    getUsers()
  }
  sharingIsInProrgess.value = false
}

// OPEN-CLOSE DIALOG

const dialogIsOpen = computed({
  get: () => settingsStore.shareListDialog.isOpen,
  set: () => onDialogClose(),
})

const onDialogClose = () => {
  settingsStore.closeShareListDialog()
}

// WATCHER

watch(dialogIsOpen, (newValue) => {
  if (newValue) {
    users.value = []
    newUserLogin.value = ''
    getUsers()
  }
})

</script>

<style>
.share-list-users {
  margin-bottom: 10px;
}

.share-list-users-loading {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.share-list-users .share-list-user-item {
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}

.share-list-user-item:hover {
  background-color: rgba(133, 133, 133, 0.088);
}

.share-list-user-item-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.share-list-add-new {
  margin-top: 20px;
}

.share-list-add-new-input-and-button {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.share-list-add-new .v-input__details {
  display: none;
}
</style>
