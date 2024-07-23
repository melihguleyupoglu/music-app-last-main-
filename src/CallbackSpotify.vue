<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
// import { useAuthStore } from '@/store/auth.ts'
import { mainAuthStore } from './main'
// import api from './services/api'

// const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  const hash = window.location.hash.substring(1)
  const params = new URLSearchParams(hash)
  const accessToken = params.get('access_token')

  const mainAccessToken = localStorage.getItem('access_token')
  // const refreshToken = await api.getRefreshToken()

  if (accessToken) {
    localStorage.setItem('spotify_access_token', accessToken)

    mainAuthStore.setSpotifyAccessToken(accessToken)
    mainAuthStore.setAccessToken(mainAccessToken)
    // mainAuthStore.setRefreshToken(refreshToken)

    console.log(accessToken)
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
