import axios from 'axios'

axios.defaults.withCredentials = true

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true
})

async function refreshAccessToken() {
  try {
    const response = await axios.post(
      'http://localhost:3000/refresh-token',
      {},
      {
        withCredentials: true
      }
    )

    return response.data.accessToken
  } catch (error) {
    console.error('Error refreshing access token: ', error)
    return null
  }
}

async function fetchAccessToken() {
  try {
    const response = await axios.get('http://localhost:3000/get-access-token')
    return response.data.accessToken
  } catch (error) {
    console.error('Error fetching the access token: ', error)
  }
}

// async function getRefreshToken() {
//   try {
//     // const accessToken = getAccessToken()
//     const response = await axios.post(
//       'http://localhost:3000/get-refresh-token',
//       {},
//       { withCredentials: true }
//     )
//     const refreshToken = response.data.refreshToken
//     return refreshToken
//   } catch (error) {
//     console.error('Error fetching the refresh token: ', error)
//     return null
//   }
// }

// function isTokenExpired(token) {
//   if (!token) return true

//   const decoded = jwtDecode(token)
//   const currentTimeInSeconds = Date.now() / 1000

//   return decoded.exp < currentTimeInSeconds
// }

// eslint-disable-next-line no-unused-vars
async function verifyAccessToken() {
  try {
    const response = await axios.post(
      'http://localhost:3000/verify-token',
      {},
      { withCredentials: true }
    )
    return response.data
  } catch (error) {
    console.error('Error verifying access token: ', error)
    return null
  }
}

// function isRefreshTokenExpired(token) {
//   if (!token) return true

//   const decoded = jwtDecode(token)
//   const currentTimeInSeconds = Date.now() / 1000

//   return decoded.exp < currentTimeInSeconds
// }

api.interceptors.request.use(
  async (config) => {
    const accessToken = fetchAccessToken()

    if (accessToken && api.isTokenExpired(accessToken)) {
      const newToken = await refreshAccessToken()
      if (newToken) {
        config.headers['Authorization'] = `Bearer ${newToken}`
      }
    } else if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

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

// api.isTokenExpired = isTokenExpired

// api.isRefreshTokenExpired = isRefreshTokenExpired

api.refreshAccessToken = refreshAccessToken

// api.getRefreshToken = getRefreshToken

api.verifyAccessToken = verifyAccessToken

api.fetchAccessToken = fetchAccessToken

export default api
