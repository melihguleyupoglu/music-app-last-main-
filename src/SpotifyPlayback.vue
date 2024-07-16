<template>
  <div class="container">
    <div class="main-wrapper">
      <img :src="currentTrack.album.images[0].url" class="now-playing__cover" alt="Album Cover" />

      <div class="now-playing__side">
        <div class="now-playing__name">{{ currentTrack.name }}</div>
        <div class="now-playing__artist">{{ currentTrack.artists[0].name }}</div>
      </div>
    </div>
    <div class="button-wrapper">
      <button class="btn-spotify" @click="player.previousTrack()">Previous Track</button>
      <button class="btn-spotify" @click="togglePlay">{{ isPaused ? 'PLAY' : 'PAUSE' }}</button>
      <button class="btn-spotify" @click="player.nextTrack()">Next Track</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const token = localStorage.getItem('spotify_access_token')

const track = {
  name: 'sdp interlude',
  album: {
    images: [
      {
        url: 'https://t2.genius.com/unsafe/1416x0/https%3A%2F%2Fimages.genius.com%2F5f66b21e0c69ff6c30080f2c6795f025.924x924x1.jpg'
      }
    ]
  },
  artists: [{ name: 'Travis Scott' }],
  uri: 'https://open.spotify.com/intl-tr/track/4gh0ZnHzaTMT1sDga7Ek0N?si=4753e222f5254004'
}

const player = ref(null)
const isPaused = ref(false)
const isActive = ref(false)
const currentTrack = ref(track)

const setPlayer = (newPlayer) => {
  player.value = newPlayer
}

const setPaused = () => {
  isPaused.value = true
}

const setActive = () => {
  isActive.value = true
}

const setTrack = (newTrack) => {
  currentTrack.value = newTrack
}

const togglePlay = () => {
  if (player.value) {
    player.value.togglePlay().then(() => {
      console.log('Play request')
      isPaused.value = !isPaused.value
    })
  }
}

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://sdk.scdn.co/spotify-player.js'
  script.async = true

  document.body.appendChild(script)

  window.onSpotifyWebPlaybackSDKReady = () => {
    const newPlayer = new Spotify.Player({
      name: 'Web Playback SDK',
      getOAuthToken: (cb) => {
        cb(token) // token değerini callback ile geçiriyoruz
      },
      volume: 1
    })

    setPlayer(newPlayer)

    newPlayer.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID:', device_id)
    })

    newPlayer.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id)
    })

    newPlayer.addListener('player_state_changed', (state) => {
      if (!state) {
        return
      }

      setTrack(state.track_window.current_track)
      setPaused(state.paused)

      newPlayer.getCurrentState().then((state) => {
        setActive(!!state)
      })
    })

    newPlayer.connect()
  }
})
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.main-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.now-playing__cover {
  max-width: 200px;
  max-height: 200px;
  border-radius: 10px;
  margin-right: 20px;
}

.now-playing__side {
  display: flex;
  flex-direction: column;
}

.now-playing__name {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.now-playing__artist {
  font-size: 1rem;
  color: #888;
}

.button-wrapper {
  display: flex;
  justify-content: center;
}

.btn-spotify {
  margin: 0 10px;
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #1db954;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-spotify:hover {
  background-color: #1ed760;
}
</style>
