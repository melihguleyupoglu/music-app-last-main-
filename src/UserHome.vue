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
  <div class="welcome-message">
    <p>Welcome, to get started please link your accounts.</p>
  </div>
  <div class="button-container">
    <button
      class="sp-button generic-button"
      @click="spotifyStore.authorizeSpotify(), saveUiState()"
      aria-label="Link your spotify account"
      v-if="!spotifyStore.isSpotifyAuthenticated"
    >
      Link your spotify account
    </button>
    <button
      class="generic-button"
      v-if="spotifyStore.isSpotifyAuthenticated"
      @click="spotifyStore.authorizeSpotify(), saveUiState()"
    >
      Get your stats
    </button>
  </div>
  <div class="info-text">
    <svg
      class="info-svg"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      style="fill: rgba(0, 0, 0, 1); msfilter:"
    >
      <path
        d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"
      ></path>
      <path d="M11 11h2v6h-2zm0-4h2v2h-2z"></path>
    </svg>
    <p>
      To continue with a different account you can log out your spotify account on your used browser
    </p>
  </div>
</template>
<style>
.welcome-message {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  margin-top: 10%;
  p {
    font-size: x-large;
  }
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

.info-text {
  margin-top: 5rem;
  margin-left: 5rem;
}

@media screen and (max-width: 415px) {
  .welcome-message {
    p {
      font-size: medium;
    }
  }
}
</style>
