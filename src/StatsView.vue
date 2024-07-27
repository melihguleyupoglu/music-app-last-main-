<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useStatsStateStore } from './store/statsState'

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

const statsStateStore = useStatsStateStore()

const token = localStorage.getItem('spotify_access_token')
const topTracks = ref<Track[]>([])
const selection = ref('tracks')
const timeRange = ref('short_term')

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

async function getTopTracksOrArtists() {
  if (!token) {
    console.error('Access token not found')
    return []
  }

  const endpoint =
    selection.value === 'tracks'
      ? `v1/me/top/tracks?time_range=${timeRange.value}&limit=5`
      : `v1/me/top/artists?time_range=${timeRange.value}&limit=5`

  try {
    const data = await fetchWebApi(endpoint, 'GET', {})
    return data.items as Track[]
  } catch (error) {
    console.error('Spotify API error:', error)
    return []
  }
}

const getSelectedStats = async () => {
  statsStateStore.setStatus({ isWaiting: false, isLoading: true })
  topTracks.value = await getTopTracksOrArtists()
  if (topTracks.value) {
    statsStateStore.setStatus({ isLoading: false, isReady: true })
  }
}

// onMounted(() => {})

// watch([selection, timeRange], async () => {
//   topTracks.value = await getTopTracksOrArtists()
// })
</script>

<template>
  <div>
    <div v-if="statsStateStore.isWaiting" class="selection__container">
      <div class="selection__first">
        <h1>Get your stats</h1>
        <label for="selection">Choose type: </label>
        <select class="selection" id="selection" v-model="selection">
          <option value="tracks">Tracks</option>
          <option value="artists">Artists</option>
        </select>
      </div>
      <div class="selection__second">
        <label for="timeRange">Choose time range: </label>
        <select class="selection" id="timeRange" v-model="timeRange">
          <option value="short_term">Last Month</option>
          <option value="medium_term">Last 6 Months</option>
          <option value="long_term">Last Year</option>
        </select>
      </div>
      <div class="button__container">
        <button @click="getSelectedStats" class="submit__button">Get my stats</button>
      </div>
    </div>
    <div class="stats__container">
      <div v-if="topTracks.length">
        <h2>Top {{ selection === 'tracks' ? 'Tracks' : 'Artists' }}:</h2>
        <ul v-if="statsStateStore.isDisplayModeEnabled">
          <li v-for="track in topTracks" :key="track.id">
            {{ track.name }} by {{ track.artists.map((artist) => artist.name).join(', ') }}
          </li>
        </ul>
        <ul class="track__image__container" v-if="selection === 'tracks'">
          <li v-for="(track, index) in topTracks" :key="track.id">
            <img
              :src="track.album.images[0].url"
              :class="index % 2 === 0 ? 'even__image' : 'odd__image'"
              alt="Track Image"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>
h1 {
  margin-bottom: 2%;
}

h2 {
  margin-bottom: 2%;
}

.stats__container {
  margin-top: 2%;
}

.selection__container {
  display: flex;
  flex-direction: column;
  align-items: center; /* Container içindeki elemanları ortalamak için */
  margin-top: 5%;
}

.selection__first,
.selection__second {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
}

.button__container {
  display: flex;
  justify-content: center;
}

.track__image__container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
}

.even__image {
  grid-column: 1 / 3;
  max-height: 250px;
  max-width: 250px;
}

.odd__image {
  grid-column: 2 / -1;
  max-height: 250px;
  max-width: 250px;
  align-self: center;
}

.even__image,
.odd__image {
  grid-row: 1/2;
}

.track__image {
  grid-column: 1 / 3;
  max-height: 250px;
  max-width: 250px;
}

.selection {
  border-radius: 4px;
}

select {
  margin-left: 1%;
}

.stats__container {
  margin-left: 10%;
  /* margin-top: -15%; */
}
</style>
