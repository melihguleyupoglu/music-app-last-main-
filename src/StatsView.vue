<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Artist {
  name: string
}

interface Image {
  url: string
}

interface Album {
  images: Image[]
}

interface Track {
  id: string
  name: string
  artists: Artist[]
  album: Album
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
    const data = await fetchWebApi('v1/me/top/tracks?time_range=short_term&limit=5', 'GET', {})
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
      <ul class="track__image__container">
        <li v-for="track in topTracks" :key="track.id">
          <img :src="track.album.images[0].url" class="track__image" alt="Track Image" />
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
  flex-direction: column;
}
.track__image__container {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
.track__image {
  max-height: 250px;
  max-width: 250px;
}
</style>
