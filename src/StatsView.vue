<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useLoadingStateStore } from './store/loadingStateStore'
import { gridAnimation } from './animations.js'
import { spotifyStore } from './main'

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

const statsStateStore = useLoadingStateStore()
const token = spotifyStore.spotifyAccessToken
const topTracks = ref<Track[]>([])
const selection = ref('tracks')
const timeRange = ref('short_term')
const isGrid = ref(true)
const itemNumber = ref(15)

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
      ? `v1/me/top/tracks?time_range=${timeRange.value}&limit=${itemNumber.value}`
      : `v1/me/top/artists?time_range=${timeRange.value}&limit=${itemNumber.value}`

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
  if (topTracks.value.length > 0) {
    statsStateStore.setStatus({ isLoading: false, isReady: true })
  }
}

const handleButtonClick = async () => {
  await getSelectedStats()
}

const toggleView = () => {
  isGrid.value = !isGrid.value
}

const handleImageLoad = (event: Event) => {
  const imgElement = event.target as HTMLImageElement
  imgElement.parentElement?.classList.add('loaded')
  gridAnimation('.track__image__container', 3, 5)
}

const setSelection = (newSelection) => {
  selection.value = newSelection
  console.log(selection.value)
}

const setTimeRange = (newTimeRange) => {
  timeRange.value = newTimeRange
  console.log(timeRange.value)
}

const setItemNumber = (newNumber) => {
  itemNumber.value = newNumber
  console.log(itemNumber.value)
}
// watch(topTracks, () => {
//   handleButtonClick()
// })
</script>

<template>
  <div>
    <div v-if="statsStateStore.isWaiting" class="selection__container">
      <h1>Get your stats</h1>
      <div class="selection selection__first">
        <h2>Type:</h2>
        <button
          class="generic-button"
          @click="setSelection('tracks')"
          :class="{ active: selection === 'tracks' }"
          :aria-pressed="selection === 'tracks' ? 'true' : 'false'"
        >
          Tracks
        </button>
        <button
          class="generic-button"
          @click="setSelection('artists')"
          :class="{ active: selection === 'artists' }"
          :aria-pressed="selection === 'artists' ? 'true' : 'false'"
        >
          Artists
        </button>
      </div>
      <div class="selection selection__second">
        <h2>Time Range:</h2>
        <button
          class="generic-button"
          @click="setTimeRange('short_term')"
          :class="{ active: timeRange === 'short_term' }"
          :aria-pressed="timeRange === 'short_term' ? 'true' : 'false'"
        >
          Last Month
        </button>
        <button
          class="generic-button"
          @click="setTimeRange('medium_term')"
          :class="{ active: timeRange === 'medium_term' }"
          :aria-pressed="timeRange === 'medium_term' ? 'true' : 'false'"
        >
          Last 6 Months
        </button>
        <button
          class="generic-button"
          @click="setTimeRange('long_term')"
          :class="{ active: timeRange === 'long_term' }"
          :aria-pressed="timeRange === 'long_term' ? 'true' : 'false'"
        >
          Last 12 Months
        </button>
      </div>
      <div class="selection selection__third">
        <h2>Stat Number:</h2>
        <button
          class="generic-button"
          @click="setItemNumber(15)"
          :class="{ active: itemNumber === 15 }"
          :aria-pressed="itemNumber === 15 ? 'true' : 'false'"
        >
          15
        </button>
        <button
          class="generic-button"
          @click="setItemNumber(25)"
          :class="{ active: itemNumber === 25 }"
          :aria-pressed="itemNumber === 25 ? 'true' : 'false'"
        >
          25
        </button>
      </div>
      <div class="button__container">
        <button
          @click="handleButtonClick"
          class="generic-button submit__button"
          aria-label="Get your stats"
        >
          Get my stats
        </button>
      </div>
    </div>
    <div class="stats__container">
      <div v-if="topTracks.length">
        <!-- <button @click="toggleView" class="toggle__button"></button> -->
        <div class="view__toggle">
          <span
            id="gridView"
            :class="{ active: isGrid, clickable: !isGrid }"
            :disabled="isGrid"
            v-on:click="!isGrid && toggleView()"
          >
            Grid
          </span>
          <span
            id="flexView"
            :class="{ active: !isGrid, clickable: isGrid }"
            :disabled="!isGrid"
            v-on:click="isGrid && toggleView()"
            >List</span
          >
        </div>

        <ul
          class="track__image__container"
          :class="{ grid: isGrid, list: !isGrid }"
          v-if="selection === 'tracks'"
          style="list-style-type: none"
        >
          <li v-for="(track, index) in topTracks" :key="track.id" class="track__item">
            <h2 class="track__ranking" v-if="!isGrid">{{ index + 1 }}</h2>
            <img
              :src="track.album.images[0].url"
              class="track__image"
              :id="'track-' + index"
              @load="handleImageLoad($event)"
              :alt="`Album cover for ${track.name} by ${track.artists.map((artist) => artist.name).join(', ')}`"
            />
            <div class="track__image-overlay"></div>
            <p class="track__artist-text">
              {{ track.name }} by {{ track.artists.map((artist) => artist.name).join(', ') }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view__toggle {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4%;
  /* margin-top: 0%; */
  font-size: xx-large;
}

.view__toggle .active {
  font-weight: bold;
  /* color: #000; */
  /* cursor: not-allowed; */
}

.view-toggle span:not(.active) {
  color: #007bff;
}

.view__toggle span {
  /* cursor: pointer; */
  padding: 5px 10px;
}

h1 {
  font-size: 4rem;
}

h2 {
  font-size: xx-large;
}

.stats__container {
  margin-top: 2%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.selection__container {
  margin-top: 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-left: 20%;
  gap: 10px;
}

.generic-button {
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  cursor: pointer;
  font-weight: normal;
  font-size: xx-large;
}

.generic-button.active {
  font-weight: bold;
  outline: none;
}

.generic-button:hover {
  outline: 2px solid white;
}

.selection {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.track__image__container {
  transition: all 0.5s ease-in-out;
}

.track__image__container.grid {
  display: grid;
  column-gap: 120px;
  row-gap: 50px;
  grid-template-columns: repeat(5, 150px);
}

.track__image__container.list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 30px;
  .track__item {
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: center;
  }
}

.track__item {
  position: relative;
  transition: transform 0.5s ease-in-out;
}

.track__image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  position: relative;
}

.track__image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 150px;
  height: 150px;
  background-color: rgba(0, 0, 0, 1);
  opacity: 1;
  transition: opacity 1s ease-in-out;
  z-index: 1;
}

.track__item.loaded .track__image {
  opacity: 1;
}

.track__item.loaded .track__image-overlay {
  opacity: 0;
}

.track__item:hover {
  scale: 1.1;
}

.toggle__button {
  margin-bottom: 20px;
}

.track__ranking {
  font-weight: bold;
}

.track__artist-text {
  font-weight: bolder;
}

.toggle__button {
  padding: 0 0 0 0;
}

.grid__image {
  height: 30px;
  width: 30px;
}
</style>
