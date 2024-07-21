import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { mainAuthStore } from '../main'

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

const getAccessToken = () => mainAuthStore.getAccessToken
// const setAccessToken = (token) => mainAuthStore.setAccessToken(token)

async function refreshAccessToken() {
  try {
    const accessToken = getAccessToken()
    const response = await axios.post('http://localhost:3000/refresh-token', { accessToken })
    mainAuthStore.setAccessToken(response.data.accessToken)
    return response.data.accessToken
  } catch (error) {
    console.error('Error refreshing access token: ', error)
    mainAuthStore.clearTokens()
    return null
  }
}

api.interceptors.request.use(
  async (config) => {
    if (mainAuthStore.access_token && isTokenExpired(mainAuthStore.access_token)) {
      const newToken = await refreshAccessToken()
      if (newToken) {
        config.headers['Authorization'] = `Bearer ${newToken}`
      }
    } else if (mainAuthStore.access_token) {
      config.headers['Authorization'] = `Bearer ${mainAuthStore.access_token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor ile token yenileme
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const newAccessToken = await refreshAccessToken()
      if (newAccessToken) {
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
        return api(originalRequest)
      }
    }
    return Promise.reject(error)
  }
)

// Access token'ın süresini kontrol eden fonksiyon
function isTokenExpired(token) {
  if (!token) return true

  const decoded = jwtDecode(token)
  const currentTimeInSeconds = Date.now() / 1000

  // Token'ın geçerliliği currentTimeInSeconds zamanına göre kontrol edilir
  return decoded.exp < currentTimeInSeconds
}

function isRefreshTokenExpired(token) {
  if (!token) return true

  const decoded = jwtDecode(token)
  const currentTimeInSeconds = Date.now() / 1000

  // Token'ın geçerliliği currentTimeInSeconds zamanına göre kontrol edilir
  return decoded.exp < currentTimeInSeconds
}

// isTokenExpired fonksiyonunu export et
api.isTokenExpired = isTokenExpired

api.isRefreshTokenExpired = isRefreshTokenExpired

api.refreshAccessToken = refreshAccessToken

export default api
