<template>
<v-list-item
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
        <strong v-if="userIsMe">{{ user.name }} (me)</strong>
        <span v-else>{{ user.name }}</span>
      </span>
      <v-btn
        v-if="showRemoveBtn"
        @click="emit('remove')"
        :disabled="removeIsInProgress"
        :loading="removeIsInProgress"
        color="red"
        prepend-icon="mdi-account-remove"
      >
        Remove
      </v-btn>
    </div>
  </template>
</v-list-item>
</template>

<script setup lang="ts">
import { UserWithName } from '../../types/types'

const { user, showRemoveBtn, removeIsInProgress } = defineProps<DialogShareListItemProps>()
const emit = defineEmits([ 'remove' ])


interface DialogShareListItemProps {
  user: UserWithName
  userIsMe?: boolean
  showRemoveBtn?: boolean
  removeIsInProgress?: boolean
}
</script>

<style>
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
</style>
