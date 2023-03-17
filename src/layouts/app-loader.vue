<template>
  <div class="app-loader">
      <v-progress-circular
        :size="50"
        color="light-blue-darken-4"
        indeterminate
      ></v-progress-circular>
    </div>
</template>

<style>
.app-loader {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
