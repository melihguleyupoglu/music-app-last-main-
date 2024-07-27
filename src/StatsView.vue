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
        <h1>Top {{ selection === 'tracks' ? 'Tracks' : 'Artists' }}:</h1>
        <ul v-if="statsStateStore.isDisplayModeEnabled">
          <li v-for="track in topTracks" :key="track.id">
            {{ track.name }} by {{ track.artists.map((artist) => artist.name).join(', ') }}
          </li>
        </ul>
        <ul
          class="track__image__container"
          v-if="selection === 'tracks'"
          style="list-style-type: none"
        >
          <li v-for="(track, index) in topTracks" :key="track.id">
            <img
              :src="track.album.images[0].url"
              :style="{
                zIndex: topTracks.length - index,
                transform: `translate(${index * 90}px, ${index * 0}px)`
              }"
              class="track__image"
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
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 2%;
}

.track__image {
  max-width: 150px;
  max-height: 150px;
  position: absolute;
  transition: transform 0.3s ease-in-out;
}

.track__image__container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative; /* Bağıl konumlandırma */
  width: 100%;
  max-width: 400px; /* Konteyner genişliği */
  height: 300px; /* Konteyner yüksekliği */
  right: 150%;
}

/* Responsive Tasarım */
@media (max-width: 768px) {
  .track__image__container {
    height: 200px; /* Daha küçük ekranlar için yükseklik */
  }

  .track__image {
    max-width: 100px;
    max-height: 100px;
  }
}

@media (max-width: 650px) {
  .track__image__container {
    height: 150px; /* Daha küçük ekranlar için yükseklik */
  }

  .track__image {
    max-width: 75px;
    max-height: 75px;
  }
}

@media (max-width: 530px) {
  .track__image__container {
    height: 100px;
  }

  .track__image {
    max-width: 50px;
    max-height: 50px;
  }
}

.selection__container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
