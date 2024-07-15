<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
onMounted(() => {
  const hash = window.location.hash.substring(1)
  const params = new URLSearchParams(hash)
  const accessToken = params.get('access_token')

  if (accessToken) {
    localStorage.setItem('spotify_access_token', accessToken)
    console.log(accessToken)

    router.push({ path: '/player' })
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
