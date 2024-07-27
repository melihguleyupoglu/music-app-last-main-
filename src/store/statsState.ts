import { defineStore } from 'pinia'

export const useStatsStateStore = defineStore('statsState', {
  state: () => ({
    isWaiting: true,
    isLoading: false,
    isReady: false,
    isDisplayModeEnabled: false
  }),
  actions: {
    setIsWaiting(newState: boolean) {
      this.isWaiting = newState
    },
    setIsLoading(newState: boolean) {
      this.isLoading = newState
    },
    setIsReady(newState: boolean) {
      this.isReady = newState
    },
    setIsDisplayModeEnabled(newState: boolean) {
      this.isDisplayModeEnabled = newState
    },
    setStatus(status: {
      isWaiting?: boolean
      isLoading?: boolean
      isReady?: boolean
      isDisplayModeEnabled?: boolean
    }) {
      if (typeof status.isWaiting !== 'undefined') this.isWaiting = status.isWaiting
      if (typeof status.isLoading !== 'undefined') this.isLoading = status.isLoading
      if (typeof status.isReady !== 'undefined') this.isReady = status.isReady
      if (typeof status.isDisplayModeEnabled !== 'undefined')
        this.isDisplayModeEnabled = status.isDisplayModeEnabled
    }
  }
})
