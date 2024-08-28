import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    isDarkMode: true
  }),
  actions: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode
      this.applyDarkMode()
    },
    applyDarkMode() {
      const bodyClass = document.body.classList
      if (this.isDarkMode) {
        bodyClass.add('dark-mode')
      } else {
        bodyClass.remove('dark-mode')
      }
    },
    setDarkMode(isDarkMode) {
      this.isDarkMode = isDarkMode
      this.applyDarkMode()
    }
  }
})
