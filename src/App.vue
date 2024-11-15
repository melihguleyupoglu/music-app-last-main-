<script setup lang="ts">
import AppNavbar from './routes/AppNavbar.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <AppNavbar />
  <main>
    <RouterView />
  </main>
</template>

<style></style>
