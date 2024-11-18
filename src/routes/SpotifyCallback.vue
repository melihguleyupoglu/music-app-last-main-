<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { spotifyStore } from '../main'

const router = useRouter()

onMounted(async () => {
  const hash = window.location.hash.substring(1)
  const params = new URLSearchParams(hash)
  const spotifyAccessToken = params.get('access_token')

  if (spotifyAccessToken) {
    spotifyStore.saveSpotifyAccessToken(spotifyAccessToken)

    router.push({ path: '/stats' })
  } else {
    router.push({ path: '/home' })
  }
})
</script>
<template>
  <div>
    <h1>Spotify Authorization Callback</h1>
  </div>
</template>
<style></style>
