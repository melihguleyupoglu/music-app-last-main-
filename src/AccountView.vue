<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="button__container">
    <RouterLink to="/login">
      <button class="login-button button generic-button">Login</button>
    </RouterLink>

    <RouterLink class="router-signup-button" to="/signup">
      <button class="signup-button button generic-button">Signup</button>
    </RouterLink>
  </div>
</template>

<style scoped>
.button__container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15%;
  gap: 20px;
}
</style>
