<script setup lang="ts">
import { ref } from 'vue'
import { useLoadingStateStore } from '../store/loadingStateStore'
import { spotifyStore } from '../main'

interface Artist {
  id: string
  name: string
  images: Image[]
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

const loadingStateStore = useLoadingStateStore()
const spotifyAccessToken = spotifyStore.spotifyAccessToken

const topTracks = ref<Track[]>([])
const topArtists = ref<Artist[]>([])

const selection = ref<'tracks' | 'artists'>('tracks')
const timeRange = ref<'short_term' | 'medium_term' | 'long_term'>('short_term')
const itemNumber = ref(15)

const isGrid = ref(true)

async function fetchWebApi(endpoint: string, method: string, body: object) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${spotifyAccessToken}`,
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

const getTopStats = async () => {
  if (!spotifyAccessToken) {
    console.error('Access token not found')
    return []
  }

  const endpoint =
    selection.value === 'tracks'
      ? `v1/me/top/tracks?time_range=${timeRange.value}&limit=${itemNumber.value}`
      : `v1/me/top/artists?time_range=${timeRange.value}&limit=${itemNumber.value}`

  try {
    const data = await fetchWebApi(endpoint, 'GET', {})
    return selection.value === 'tracks' ? (data.items as Track[]) : (data.items as Artist[])
  } catch (error) {
    console.error('Spotify API error:', error)
    return []
  }
}

const getSelectedStats = async () => {
  loadingStateStore.setStatus({ isWaiting: false, isLoading: true })
  if (selection.value === 'tracks') {
    topTracks.value = (await getTopStats()) as Track[]
  } else if (selection.value === 'artists') {
    topArtists.value = (await getTopStats()) as Artist[]
  }
  if (topTracks.value.length > 0 || topArtists.value.length > 0) {
    loadingStateStore.setStatus({ isLoading: false, isReady: true })
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
}

const setSelection = (newSelection: 'tracks' | 'artists') => {
  selection.value = newSelection
}

const setTimeRange = (newTimeRange: 'short_term' | 'medium_term' | 'long_term') => {
  timeRange.value = newTimeRange
  console.log(timeRange.value)
}

const setItemNumber = (newNumber: 15 | 25) => {
  itemNumber.value = newNumber
  console.log(itemNumber.value)
}
</script>

<template>
  <div>
    <div v-if="loadingStateStore.isWaiting" class="selection__container">
      <div class="selection selection__first">
        <h2 class="grid-first">Type:</h2>
        <button
          class="generic-button grid-second"
          @click="setSelection('tracks')"
          :class="{ active: selection === 'tracks' }"
          :aria-pressed="selection === 'tracks' ? 'true' : 'false'"
        >
          Tracks
        </button>
        <button
          class="generic-button grid-third"
          @click="setSelection('artists')"
          :class="{ active: selection === 'artists' }"
          :aria-pressed="selection === 'artists' ? 'true' : 'false'"
        >
          Artists
        </button>
      </div>
      <div class="selection selection__second">
        <h2 class="grid-first">Time Range:</h2>
        <button
          class="generic-button grid-second"
          @click="setTimeRange('short_term')"
          :class="{ active: timeRange === 'short_term' }"
          :aria-pressed="timeRange === 'short_term' ? 'true' : 'false'"
        >
          Last Month
        </button>
        <button
          class="generic-button grid-third"
          @click="setTimeRange('medium_term')"
          :class="{ active: timeRange === 'medium_term' }"
          :aria-pressed="timeRange === 'medium_term' ? 'true' : 'false'"
        >
          Last 6 Months
        </button>
        <button
          class="generic-button grid-fourth"
          @click="setTimeRange('long_term')"
          :class="{ active: timeRange === 'long_term' }"
          :aria-pressed="timeRange === 'long_term' ? 'true' : 'false'"
        >
          Last 12 Months
        </button>
      </div>
      <div class="selection selection__third">
        <h2 class="grid-first">Stat Number:</h2>
        <button
          class="generic-button grid-second"
          @click="setItemNumber(15)"
          :class="{ active: itemNumber === 15 }"
          :aria-pressed="itemNumber === 15 ? 'true' : 'false'"
        >
          15
        </button>
        <button
          class="generic-button grid-third"
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
          class="generic-button grid-second-third"
          aria-label="Get your stats"
        >
          Get my stats
        </button>
      </div>
    </div>
    <div class="stats__container">
      <div v-if="topTracks.length | topArtists.length">
        <div class="view__toggle">
          <button
            class="generic-button"
            :class="{ active: isGrid, clickable: !isGrid }"
            v-on:click="!isGrid && toggleView()"
          >
            Grid
          </button>
          <button
            class="generic-button"
            :class="{ active: !isGrid, clickable: isGrid }"
            v-on:click="isGrid && toggleView()"
          >
            List
          </button>
        </div>

        <ul
          class="generic__image__container"
          :class="{ grid: isGrid, list: !isGrid }"
          v-if="selection === 'tracks'"
          style="list-style-type: none"
        >
          <li v-for="(track, index) in topTracks" :key="track.id" class="generic__item">
            <h2 class="generic__ranking" v-if="!isGrid">{{ index + 1 }}</h2>
            <img
              :src="track.album.images[0].url"
              class="generic__image"
              :id="'track-' + index"
              @load="handleImageLoad($event)"
              :alt="`Album cover for ${track.name} by ${track.artists.map((artist) => artist.name).join(', ')}`"
            />
            <div class="generic__image-overlay"></div>
            <p class="generic-text">
              <span style="font-weight: 900" v-if="isGrid">{{ index + 1 }}. </span
              >{{ track.name }} by
              {{ track.artists.map((artist) => artist.name).join(', ') }}
            </p>
          </li>
        </ul>
        <ul
          class="generic__image__container"
          :class="{ grid: isGrid, list: !isGrid }"
          style="list-style-type: none"
          v-if="selection === 'artists'"
        >
          <li v-for="(artist, index) in topArtists" :key="artist.id" class="generic__item">
            <h2 class="generic__ranking" v-if="!isGrid">{{ index + 1 }}</h2>
            <img
              :src="artist.images[0].url"
              class="generic__image"
              :id="'track-' + index"
              @load="handleImageLoad($event)"
            />
            <div class="generic__image-overlay"></div>
            <p class="generic-text">
              <span style="font-weight: 900" v-if="isGrid">{{ index + 1 }}. </span>{{ artist.name }}
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
  gap: 1rem;
  font-size: xx-large;
}

.view__toggle .active {
  font-weight: bold;
}

.view-toggle span:not(.active) {
  color: #007bff;
}

.view__toggle span {
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
  margin-top: 5%;
}

.selection {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
}

.grid-first {
  grid-column: 1;
  margin-left: 10%;
}
.grid-second {
  grid-column: 2;
}
.grid-third {
  grid-column: 3;
}
.grid-fourth {
  grid-column: 4;
}

.grid-second-third {
  grid-column: 2;
}

.button__container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.selection .generic-button {
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  cursor: pointer;
  font-weight: normal;
  font-size: xx-large;
  height: 5rem;
  width: 15rem;
  margin-top: -1%;
}

.generic-button.active {
  font-weight: bold;
}

.generic-button:hover {
  outline: 2px solid white;
}

.generic__image__container {
  transition: all 0.5s ease-in-out;
}

.generic__image__container.grid {
  display: grid;
  column-gap: 120px;
  row-gap: 50px;
  grid-template-columns: repeat(5, 150px);
}

.generic__image__container.list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 30px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.generic__image__container.list .generic__item {
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  width: 100%;
  position: relative;
  padding: 10px;
}

.generic__image__container.list .generic__ranking {
  min-width: 40px;
  font-size: 1.5rem;
  text-align: right;
}

.generic__image__container.list .generic__image {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
}

.generic__image__container.list .generic__image-overlay {
  width: 100px;
  height: 100px;
}

.generic__image__container.list .generic-text {
  flex-grow: 1;
  font-size: 1.1rem;
  margin: 0;
  padding-right: 20px;
}

.generic__image__container.list .generic__item:hover {
  scale: 1.02;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  .generic__image {
    outline: none;
  }
}

.generic__image__container.grid .generic__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.generic__image__container.grid .generic-text {
  margin-top: 10px;
  font-size: 0.9rem;
  line-height: 1.4;
}

.generic__item {
  position: relative;
  transition: transform 0.5s ease-in-out;
}

.generic__image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  position: relative;
}

.generic__image-overlay {
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

.generic__item.loaded .generic__image {
  opacity: 1;
}

.generic__item.loaded .generic__image-overlay {
  opacity: 0;
}

.generic__item:hover {
  scale: 1.1;
}

.toggle__button {
  margin-bottom: 20px;
}

.generic__ranking {
  font-weight: bold;
}

.generic-text {
  font-weight: bolder;
}

.toggle__button {
  padding: 0 0 0 0;
}

.grid__image {
  height: 30px;
  width: 30px;
}

body.light .generic-button:hover {
  outline: 2px solid black;
}

body.light {
  .generic__image__container.list .generic__item:hover {
    background-color: gainsboro;
    border-radius: 5px;
  }
}

@media screen and (max-width: 1400px) {
  .generic__image__container.grid {
    column-gap: 70px;
    row-gap: 40px;
    grid-template-columns: repeat(4, 1fr);
  }

  .generic__image {
    height: 120px;
    width: 120px;
  }

  .generic-text {
    font-size: 0.8rem;
  }
}

@media screen and (max-width: 1080px) {
  .generic__image__container.grid {
    column-gap: 50px;
    row-gap: 30px;
    grid-template-columns: repeat(3, 1fr);
  }

  .generic__image {
    height: 100px;
    width: 100px;
  }

  .generic-text {
    font-size: 0.7rem;
  }

  .selection {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .generic__image__container.grid {
    column-gap: 30px;
    row-gap: 20px;
    grid-template-columns: repeat(2, 1fr);
  }

  .generic__image {
    height: 80px;
    width: 80px;
  }

  .generic-text {
    font-size: 0.6rem;
  }

  .selection {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .selection h2 {
    grid-column: 1 / -1;
    margin-bottom: 10px;
  }

  .selection .generic-button {
    width: 100%;
    margin: 5px 0;
  }
}

@media screen and (max-width: 480px) {
  .generic__image__container.grid {
    column-gap: 20px;
    row-gap: 15px;
    grid-template-columns: repeat(2, 1fr);
  }

  .generic__image {
    height: 60px;
    width: 60px;
  }

  .generic-text {
    font-size: 0.5rem;
  }

  .view__toggle {
    flex-direction: column;
    gap: 0.5rem;
  }

  .view__toggle .generic-button {
    width: 100%;
    margin: 5px 0;
  }
}
</style>
