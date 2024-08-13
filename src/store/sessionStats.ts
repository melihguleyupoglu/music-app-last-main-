import { defineStore } from 'pinia'

export const useSessionStatsStore = defineStore('stats', {
  state: () => ({
    isSpotifyAuthenticated: false,
    isDarkMode: true
  })
})
