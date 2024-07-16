<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Artist {
  name: string
}

interface Track {
  id: string
  name: string
  artists: Artist[]
}

const token = localStorage.getItem('spotify_access_token')
const topTracks = ref<Track[]>([])

async function fetchWebApi(endpoint: string, method: string, body: object) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    method,
    body: method === 'GET' ? undefined : JSON.stringify(body)
  })
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`)
  }
  return await res.json()
}

async function getTopTracks() {
  if (!token) {
    console.error('Access token not found')
    return []
  }
  try {
    const data = await fetchWebApi('v1/me/top/tracks?time_range=long_term&limit=5', 'GET', {})
    return data.items as Track[]
  } catch (error) {
    console.error('Spotify API error:', error)
    return []
  }
}

onMounted(async () => {
  topTracks.value = await getTopTracks()
  console.log(
    topTracks.value.map(
      ({ name, artists }) => `${name} by ${artists.map((artist) => artist.name).join(', ')}`
    )
  )
})
</script>

<template>
  <div class="button-container">
    <!-- <button class="top-tracks-button" @click="getTopTracks">Click to get top tracks</button> -->
    <div v-if="topTracks.length">
      <h2>Top Tracks:</h2>
      <ul>
        <li v-for="track in topTracks" :key="track.id">
          {{ track.name }} by {{ track.artists.map((artist) => artist.name).join(', ') }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
