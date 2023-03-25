<template>
  <v-dialog
    v-model="dialogIsOpen"
    width="450"
  >
    <v-card
      title="Share lists requests"
      subtitle="After a confirmation these lists will appear in main window"
    >
      <v-card-text>
        <div class="share-requests-items">
          <v-list :disabled="fetchingStatus.isFetching">
            <v-list-item
              v-for="request in requestItems"
              :key="request.listId"
              class="share-request-item"
              :rounded="true"
            >
              <template v-slot:prepend>
                <v-avatar color="grey-lighten-1">
                  <v-icon color="white">mdi-format-list-bulleted</v-icon>
                </v-avatar>
              </template>

              <template v-slot:title>
                <div class="share-request-item-inner">
                  <div class="share-request-item-title">
                    <div class="share-request-item-title-main">
                      {{ request.listName }}
                    </div>
                    <div class="share-request-item-title-subtitle font-weight-light text-disabled">
                      shared by <strong>{{ request.userName }}</strong>
                    </div>
                  </div>
                  <div class="share-request-item-buttons">
                    <v-btn
                      @click="onListAccept(request.listId)"
                      :loading="fetchingStatus.listId === request.listId && fetchingStatus.action === 'accept'"
                      density="comfortable"
                      color="green"
                      icon="mdi-check"
                    ></v-btn>
                    <v-btn
                      @click="onListReject(request.listId)"
                      :loading="fetchingStatus.listId === request.listId && fetchingStatus.action === 'reject'"
                      density="comfortable"
                      color="red"
                      icon="mdi-close"
                    ></v-btn>
                  </div>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </div>
        <footer-buttons
          @cancel="dialogIsOpen = false"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useListsStore } from '../../stores/listsStore';
import { useSettingsStore } from '../../stores/settingsStore'
import FooterButtons from '../common/footer-buttons.vue'

const settingsStore = useSettingsStore()
const listsStore = useListsStore()

// REQUEST ITEMS

const requestItems = computed(() => settingsStore.userSettings?.sharedListsRequests || [])


// ACCEPT AND REJECT

const fetchingStatus = reactive({
  isFetching: false,
  listId: null as null | string,
  action: null as null | 'accept' | 'reject',
})
const startFetching = (listId: string, action: 'accept' | 'reject') => {
  fetchingStatus.isFetching = true
  fetchingStatus.listId = listId
  fetchingStatus.action = action
}
const endFetching = () => {
  fetchingStatus.isFetching = false
  fetchingStatus.listId = null
  fetchingStatus.action = null
}

const onListAccept = async (listId: string) => {
  startFetching(listId, 'accept')
  await listsStore.acceptListShare(listId)
  endFetching()
}
const onListReject = async (listId: string) => {
  startFetching(listId, 'reject')
  await listsStore.rejectListShare(listId)
  endFetching()
}


// OPEN-CLOSE DIALOG

const dialogIsOpen = computed({
  get: () => settingsStore.shareListsRequestsDialogIsOpen,
  set: () => settingsStore.shareListsRequestsDialogIsOpen = !settingsStore.shareListsRequestsDialogIsOpen,
})
</script>

<style>
.share-request-item:hover {
  background-color: rgba(133, 133, 133, 0.088);
}
.share-request-item-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.share-request-item-title-subtitle {
  font-size: 13px;
}
.share-request-item-title-subtitle strong {
  font-weight: 700;
}
.share-request-item-buttons {
  display: flex;
  gap: 15px;
}
</style>
