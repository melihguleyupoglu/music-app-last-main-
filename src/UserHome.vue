<script setup lang="ts">
// const linkYoutube = () => {}

const authorizeSpotify = () => {
  const clientId = '3b1bb569242e4fa4b6ddb4513f2eae8b'
  const redirectUri = 'http://localhost:5173/callback'
  const scopes = 'streaming user-top-read user-read-private user-read-email'
  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`
  window.open(spotifyAuthUrl, '_blank')
}

const authorizeSoundcloud = () => {}
</script>
<template>
  <div>
    <h2 class="welcome-message">Welcome, to get started please link your accounts.</h2>
  </div>
  <div class="button-container">
    <!-- <button class="button yt-button" @click="linkYoutube">Link your youtube account</button> -->
    <button class="button sp-button" @click="authorizeSpotify">
      Link your spotify account (Needs premium)
    </button>
    <button class="button sc-button" @click="authorizeSoundcloud">
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
