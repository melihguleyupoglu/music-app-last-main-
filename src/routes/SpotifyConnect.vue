<script setup lang="ts">
import { spotifyStore } from '../main'
import { uiStore } from '../main'

const isSpotifyAuthenticated = spotifyStore.isSpotifyAuthenticated

const saveUiState = () => {
  const currentUiState = uiStore.isDarkMode
  if (currentUiState) {
    localStorage.setItem('localIsDarkMode', 'true')
  } else {
    localStorage.setItem('localIsDarkMode', 'false')
  }
}
</script>

<template>
  <div class="welcome-message">
    <p v-if="!isSpotifyAuthenticated">Welcome, to get started please link your accounts.</p>
    <p v-if="isSpotifyAuthenticated">Welcome, get ready to get your stats</p>
  </div>
  <div class="button-container">
    <button
      class="generic-button"
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
      aria-label="Get your listening stats from spotify"
    >
      Get your stats
    </button>
  </div>
  <div class="info-text">
    <p>
      ℹ️ To continue with a different account you can log out your spotify account on your browser
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
