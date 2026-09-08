<template>
  <v-app>
    <NavigationDrawer />
    <TopAppBar />

    <v-main class="bg-grey-lighten-4">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import NavigationDrawer from './components/NavigationDrawer.vue'
import TopAppBar from './components/TopAppBar.vue'
</script>