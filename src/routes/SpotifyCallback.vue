<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { spotifyStore } from '../main'

const router = useRouter()

onMounted(async () => {
  const hash = window.location.hash.substring(1)
  const params = new URLSearchParams(hash)
  const accessToken = params.get('access_token')

  if (accessToken) {
    spotifyStore.saveSpotifyAccessToken(accessToken)

    router.push({ path: '/stats' })
  } else {
    console.error("Access token hasn't received")
  }
})
</script>
<template>
  <div>
    <h1>Spotify Authorization Callback</h1>
  </div>
</template>
<style></style>
