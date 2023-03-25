<template>
  <div
    class="header-load-btn-wrapper"
  >
    <transition name="mode-fade">
      <v-btn
        v-if="!isTick"
        @click="onUpdateClick"
        class="absolute"
        :class="{ rotate: isRotating }"
        icon
      >
        <v-icon>mdi-autorenew</v-icon>
      </v-btn>
    </transition>
    <transition name="mode-fade">
      <v-btn
        v-if="isTick"
        @click="onUpdateClick"
        class="absolute"
        icon
      >
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { set } from 'vue-demi';
import { useListsStore } from '../../stores/listsStore';
import { useSettingsStore } from '../../stores/settingsStore'
const listsStore = useListsStore()
const settingsStore = useSettingsStore()

const isRotating = ref(false)
const isTick = ref(false)
const isFetching = computed(() => settingsStore.anyDataIsFetching)

watch(isFetching, (newValue) => {
  if (newValue) {
    isRotating.value = true
  }

  if (!newValue) {
    isTick.value = true
    setTimeout(() => {
      isTick.value = false
    }, 2000);

    setTimeout(() => {
    isRotating.value = false
    }, 1000);
  }
})

const onUpdateClick = () => {
  listsStore.getLists()
  settingsStore.getUserSettings()
}

</script>

<style scoped>
.header-load-btn-wrapper {
  position: relative;
  width: 48px;
  height: 48px;
}
.rotate {
  animation: 1.5s linear infinite rotate;
}
.absolute {
  position: absolute;
  top: 0;
  left: 0;
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
  transition: scale 0.5s ease, opacity 0.3s ease
}
.mode-fade-enter-from, .mode-fade-leave-to {
  scale: 0;
  opacity: 0;
}
</style>
