import { defineStore } from 'pinia'

export const useLoadingStateStore = defineStore('loadingState', {
  state: () => ({
    isWaiting: true,
    isLoading: false,
    isReady: false
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
    setStatus(status: { isWaiting?: boolean; isLoading?: boolean; isReady?: boolean }) {
      if (typeof status.isWaiting !== 'undefined') this.isWaiting = status.isWaiting
      if (typeof status.isLoading !== 'undefined') this.isLoading = status.isLoading
      if (typeof status.isReady !== 'undefined') this.isReady = status.isReady
    }
  }
})
