import './assets/main.css'
import { createApp, ref } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import AccountView from './AccountView.vue'
import SignupView from './SignupView.vue'
import LoginForm from './LoginForm.vue'
import UserHome from './UserHome.vue'
import CallbackSpotify from './CallbackSpotify.vue'
import PlayerView from './StatsView.vue'
import api from './services/api'
import { createPinia } from 'pinia'
import { useUiStore } from './store/uiStore'
import { watch } from 'vue'
import { computed } from 'vue'
// import { useAuthStore } from './store/auth'

const routes = [
  { path: '/', component: AccountView },
  { path: '/login', component: LoginForm },
  { path: '/signup', component: SignupView },
  { path: '/home', component: UserHome, meta: { requiresAuth: true } },
  { path: '/callback', component: CallbackSpotify },
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
const isDarkMode = computed(() => uiStore.isDarkMode)

const navbar = ref<HTMLElement | null>(null)
const bodyElement = document.body

watch(isDarkMode, (isDarkModeNew) => {
  if (!isDarkModeNew) {
    navbar.value?.classList.remove('dark')
    bodyElement.classList.remove('dark-mode')
    navbar.value?.classList.add('light')
    bodyElement.classList.add('light')
    console.log('working on if block')
  } else {
    navbar.value?.classList.remove('light')
    bodyElement.classList.remove('light')
    navbar.value?.classList.add('dark')
    bodyElement.classList.add('dark-mode')
    console.log('working on else block')
  }
})

router.beforeEach(async (to, from, next) => {
  const accessToken = await api.fetchAccessToken() //get the accessToken from cookie
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
