<template>
  <v-dialog
    v-model="dialogIsOpen"
    width="450"
    class="dialog-share-list"
  >
    <v-card
      :title="list?.name"
      :subtitle="subtitle"
    >
      <v-card-text>
        <div
          v-if="usersAreLoading || users.length"
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

          <div
            v-if="!usersAreLoading && owner"
            class="share-list-users-owner"
          >
            <p class="font-weight-light text-medium-emphasis">
              Owner
            </p>
            <v-list>
              <dialog-share-list-item
                :user="owner"
                :user-is-me="checkIsUserMe(owner.id)"
              />
            </v-list>
          </div>

          <div
            v-if="!usersAreLoading && users && users.length"
            class="share-list-users-items"
          >
            <p class="font-weight-light text-medium-emphasis">
              Shared users
            </p>
            <v-list>
              <dialog-share-list-item
                v-for="user in users"
                :key="user.id"
                :user="user"
                :user-is-me="checkIsUserMe(user.id)"
                :show-remove-btn="checkIsAbleToRemoveUser(user.id, owner?.id || '')"
                :remove-is-in-progress="userRemoveIsInProgress"
                @remove="onUserRemoveClick(user.id)"
              />
            </v-list>
          </div>
        </div>

        <v-divider />

        <div
          v-if="owner?.id === currentUserId"
          class="share-list-add-new"
        >
          <p class="font-weight-light text-medium-emphasis">
            Add new user to share with
          </p>
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
import DialogShareListItem from './dialog-share-list-item.vue'
import DialogConfirm from './dialog-confirm.vue'
import FooterButtons from '../common/footer-buttons.vue'
import { UserWithName } from '../../types/types'
import { updateDialogHeight } from '../../utils/dialogs'

const settingsStore = useSettingsStore()
const listsStore = useListsStore()

const availableWindowHeight = computed(() => settingsStore.availableWindowHeight)
const listId = computed(() => settingsStore.shareListDialog.listId)
const list = computed(() => listsStore.sortedLists.find(l => l.id === listId.value))
const currentUserId = computed(() => settingsStore.user?.id)

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

const ids = computed(() => {
  const ownerId = list.value?.users.owner
  const sharedUsersIds = list.value?.users.sharedUsers
  let idsArr: string[] = []

  if (ownerId) {
    idsArr = [ ownerId ]
  }
  if (sharedUsersIds) {
    idsArr = [ ...idsArr, ...sharedUsersIds ]
  }
  return idsArr
})
const owner = ref<UserWithName | null>(null)
const users = ref<UserWithName[]>([])
const usersAreLoading = ref(false)

const getUsers = async () => {
  if (!ids.value || !ids.value.length) {
    users.value = []
    return
  }
  let allUsersArr = []

  usersAreLoading.value = true
  allUsersArr = await settingsStore.getUserNames(ids.value)
  owner.value = allUsersArr[0]
  users.value = allUsersArr.slice(1)
  usersAreLoading.value = false
}
const checkIsUserMe = (userId: string) => {
  return currentUserId.value === userId
}

// REMOVE USER

const confirmDeleteDialogIsOpen = ref(false)
const userIdToConfirmDelete = ref('')
const userRemoveIsInProgress = ref(false)

const checkIsAbleToRemoveUser = (userId: string, ownerId: string) => {
  return currentUserId.value === ownerId || currentUserId.value === userId
}
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

// WATCHERS

watch(dialogIsOpen, (newValue) => {
  if (newValue) {
    owner.value = null
    users.value = []
    newUserLogin.value = ''
    getUsers()
  }
})
watch(availableWindowHeight, () => {
  updateDialogHeight(availableWindowHeight.value, 'dialog-share-list');
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

/* MOBILE */

@media (max-width: 600px) {
  .dialog-share-list > .v-overlay__content {
    max-width: calc(100vw - 10px) !important;
  }
  .dialog-share-list > .v-overlay__content .v-card-text {
    padding: 10px !important;
  }
}
</style>
