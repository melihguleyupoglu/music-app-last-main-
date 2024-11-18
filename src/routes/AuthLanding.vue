<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="button__container">
    <RouterLink class="routerlink" to="/login">
      <button class="login-button button generic-button" id="login-button">Login</button>
    </RouterLink>

    <RouterLink class="routerlink" to="/signup">
      <button class="signup-button button generic-button" id="signup-button">Signup</button>
    </RouterLink>
  </div>
</template>

<style scoped>
.button__container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15%;
  gap: 30px;
}
.routerlink {
  color: white;
}
</style>
