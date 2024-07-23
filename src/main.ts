import './assets/main.css'
import { createApp } from 'vue'
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
import { useAuthStore } from './store/auth'

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

export const mainAuthStore = useAuthStore()

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const accessToken = mainAuthStore.access_token

    if ((to.path === '/' || to.path === '/login' || to.path === '/signup') && accessToken) {
      return next('/')
    }

    try {
      const verifyResponse = await api.verifyAccessToken()

      if (verifyResponse && verifyResponse.message === 'Access token is valid') {
        next()
      } else {
        const newAccessToken = await api.refreshAccessToken()
        if (newAccessToken) {
          mainAuthStore.setAccessToken(newAccessToken)
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
