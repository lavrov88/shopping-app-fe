<template>
  <v-app-bar
    title="Smart shopping"
    :absolute="true"
    color="light-blue-darken-4"
  >
    <template v-slot:prepend>
      <v-app-bar-nav-icon
        @click="onMenuDrawerToggle"
      />
    </template>
    <template v-slot:append>
      <div
        class="header-right rotate"
        :class="!listsAreFetching && 'paused'"
      >
        <transition name="mode-fade">
          <v-btn
            v-if="buttonType === 'update'"
            @click="onUpdateClick"
            icon
          >
            <v-icon>mdi-autorenew</v-icon>
          </v-btn>
        </transition>
        <transition name="mode-fade">
          <v-btn
            v-if="buttonType === 'done'"
            @click="onUpdateClick"
            icon
          >
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </transition>
      </div>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed, Ref, ref, watch } from 'vue';
import { useListsStore } from '../../stores/listsStore';
import { useSettingsStore } from '../../stores/settingsStore'
const listsStore = useListsStore()
const settingsStore = useSettingsStore()

const buttonType: Ref<'update' | 'done'> = ref('update')
const listsAreFetching = computed(() => listsStore.listsAreFetching)

watch(listsAreFetching, (newValue, oldValue) => {
  if (oldValue && !newValue) {
    buttonType.value = 'done'
    setTimeout(() => {
      buttonType.value = 'update'
    }, 2000);
  }
})

const onMenuDrawerToggle = () => {
  settingsStore.optionsMenuIsOpen = !settingsStore.optionsMenuIsOpen
}
const onUpdateClick = () => {
  listsStore.getLists()
}

</script>

<style scoped>
.header-right {
  position: relative;
  width: 48px;
  height: 48px;
}

.rotate {
  animation: 2s linear infinite rotate;
}
.paused {
  animation-play-state: paused;
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.mode-fade-enter-active, .mode-fade-leave-active {
  transition: scale .5s ease
}
.mode-fade-enter-from, .mode-fade-leave-to {
  scale: 0
}
</style>
