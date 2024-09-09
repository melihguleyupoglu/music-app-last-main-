<script setup lang="ts">
import { spotifyStore } from './main'
import { uiStore } from './main'
const saveUiState = () => {
  const tempUiState = uiStore.isDarkMode
  if (tempUiState) {
    localStorage.setItem('localIsDarkMode', 'true')
  } else {
    localStorage.setItem('localIsDarkMode', 'false')
  }
}
</script>
<template>
  <div>
    <h2 class="welcome-message">Welcome, to get started please link your accounts.</h2>
  </div>
  <div class="button-container">
    <button
      class="button sp-button generic-button"
      @click="spotifyStore.authorizeSpotify(), saveUiState()"
      aria-label="Link your spotify account"
    >
      Link your spotify account
    </button>
    <button
      class="button sc-button generic-button"
      @click="spotifyStore.logoutSpotify()"
      aria-label="Link your soundcloud account"
    >
      Unlink your spotify account
    </button>
  </div>
</template>
<style>
.welcome-message {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10%;
}

.button-container {
  margin-top: 5%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 100px;
}

.button {
  height: 100px;
  width: 300px;
  border-radius: 8px;
}

.generic-button {
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  cursor: pointer;
  font-weight: normal;
  font-size: xx-large;
}

.generic-button.active {
  font-weight: bold;
  outline: none;
}

.generic-button:hover {
  outline: 2px solid white;
}

body.light .generic-button:hover {
  outline: 2px solid black;
}
</style>
