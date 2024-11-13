import './assets/main.css'
import { createApp, ref } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import AuthLanding from './routes/AuthLanding.vue'
import SignupPage from './routes/SignupPage.vue'
import LoginPage from './routes/LoginPage.vue'
import SpotifyConnect from './routes/SpotifyConnect.vue'
import SpotifyCallback from './routes/SpotifyCallback.vue'
import PlayerView from './routes/StatsPage.vue'
import api from './services/api'
import { createPinia } from 'pinia'
import { useUiStore } from './store/uiStore'
import { watch } from 'vue'
import { computed } from 'vue'
import { useSpotifyStore } from './store/spotifyStore'

const routes = [
  { path: '/', component: AuthLanding },
  { path: '/login', component: LoginPage },
  { path: '/signup', component: SignupPage },
  { path: '/home', component: SpotifyConnect, meta: { requiresAuth: true } },
  { path: '/callback', component: SpotifyCallback },
  { path: '/stats', component: PlayerView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const pinia = createPinia()
const app1 = createApp(App)

app1.use(router)
app1.use(pinia)

export const uiStore = useUiStore()
export const spotifyStore = useSpotifyStore()
const isDarkMode = computed(() => uiStore.isDarkMode)

export const authenticated = ref<boolean>(false)
const bodyClass = document.body.classList

window.addEventListener('beforeunload', () => {
  if (spotifyStore.spotifyAccessToken) {
    localStorage.setItem('spotify_access_token', spotifyStore.spotifyAccessToken)
  }
})

const token = localStorage.getItem('spotify_access_token')
if (token) {
  spotifyStore.saveSpotifyAccessToken(token)
}

watch(isDarkMode, (isDarkModeNew) => {
  if (!isDarkModeNew) {
    bodyClass.remove('light-mode')
    bodyClass.add('light-mode')
  } else {
    bodyClass.remove('light-mode')
  }
})

router.beforeEach(async (to, from, next) => {
  const accessToken = await api.fetchAccessToken() //get the accessToken from cookie
  const tempIsDark = localStorage.getItem('localIsDarkMode')
  console.log(tempIsDark)
  if (tempIsDark === 'false') {
    bodyClass.add('light-mode')
    uiStore.setDarkMode(false)
  }
  if (accessToken) {
    authenticated.value = true
  }
  console.log(accessToken)
  if ((to.path === '/' || to.path === '/login' || to.path === '/signup') && accessToken) {
    return next('/home')
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    try {
      const verifyResponse = await api.verifyAccessToken()

      if (verifyResponse && verifyResponse.message === 'Access token is valid') {
        next()
      } else {
        const newAccessToken = await api.refreshAccessToken()
        if (newAccessToken) {
          // mainAuthStore.setAccessToken(newAccessToken)
          next()
        } else {
          next('/login')
        }
      }
    } catch (error) {
      console.error('Error in route guard:', error)
      next('/login')
    }
  } else {
    next()
  }
})

app1.mount('#app')
