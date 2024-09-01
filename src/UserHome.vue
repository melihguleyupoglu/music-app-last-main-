<script setup lang="ts">
import { spotifyStore } from './main'
// import { useSpotifyStore } from './store/spotifyStore'
// const spotifyStore = useSpotifyStore()
</script>
<template>
  <div>
    <h2 class="welcome-message">Welcome, to get started please link your accounts.</h2>
  </div>
  <div class="button-container">
    <button
      class="button sp-button"
      @click="spotifyStore.authorizeSpotify()"
      aria-label="Link your spotify account"
    >
      Link your spotify account
    </button>
    <button
      class="button sc-button"
      @click="spotifyStore.logoutSpotify()"
      aria-label="Link your soundcloud account"
    >
      Link your soundcloud account
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.button {
  height: 30px;
  width: 200px;
  border-radius: 8px;
}
</style>
