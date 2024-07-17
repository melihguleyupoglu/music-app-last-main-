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

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const accessToken = mainAuthStore.getAccessToken
    const refreshToken = mainAuthStore.getRefreshToken

    console.log(accessToken)
    console.log(api.isTokenExpired(accessToken))

    if (!accessToken || api.isTokenExpired(accessToken)) {
      if (!api.isRefreshTokenExpired(refreshToken)) {
        api.refreshAccessToken()
      } else {
        if (to.path !== '/login') {
          return next('/login')
        }
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

const app1 = createApp(App)

app1.use(router)
app1.use(pinia)
export const mainAuthStore = useAuthStore()

app1.mount('#app')
