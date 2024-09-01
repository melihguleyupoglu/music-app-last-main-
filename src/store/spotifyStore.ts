import { defineStore } from 'pinia'

export const useSpotifyStore = defineStore('spotify', {
  state: () => ({
    spotifyAccessToken: null
  }),
  getters: {
    isSpotifyAuthenticated: (state) => !!state.spotifyAccessToken
  },
  actions: {
    authorizeSpotify() {
      const clientId = '3b1bb569242e4fa4b6ddb4513f2eae8b'
      const redirectUri = 'http://localhost:5173/callback'
      const scopes = 'streaming user-top-read user-read-private user-read-email'
      const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`
      window.open(spotifyAuthUrl, '_blank')
    },

    saveSpotifyAccessToken(spotifyAccessToken) {
      this.spotifyAccessToken = spotifyAccessToken
    },

    logoutSpotify() {
      this.spotifyAccessToken = null
    }
  }
})
