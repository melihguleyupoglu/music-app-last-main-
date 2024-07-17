import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    access_token: null,
    refresh_token: null,
    spotify_access_token: null
  }),
  actions: {
    setAccessToken(token) {
      this.access_token = token
    },
    setRefreshToken(token) {
      this.refresh_token = token
    },
    setSpotifyAccessToken(token) {
      this.spotify_access_token = token
    },
    clearTokens() {
      this.access_token = null
      this.refresh_token = null
      this.spotify_access_token = null
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.access_token,
    getAccessToken: (state) => state.access_token,
    getRefreshToken: (state) => state.refresh_token,
    getSpotifyAccessToken: (state) => state.spotify_access_token
  }
})
