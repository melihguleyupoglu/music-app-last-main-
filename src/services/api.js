import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const api = axios.create({
    baseURL: 'http://localhost:3000',
});


const getAccessToken = () => localStorage.getItem('access_token');
const getRefreshToken = () => localStorage.getItem('refresh_token');
const setAccessToken = (token) => localStorage.setItem('access_token', token);


async function refreshAccessToken() {
    try {
        const refreshToken = getRefreshToken();
        console.log(refreshToken);
        const response = await axios.post(`http://localhost:3000/refresh`, {
            refresh_token: refreshToken
        });
        setAccessToken(response.data.accessToken);
        return response.data.accessToken;
    } catch (error) {
        console.error('Error refreshing access token:', error);
        return null;
    }
}


api.interceptors.request.use(config => {
    const token = getAccessToken();
    if (token) {
        if (isTokenExpired(token)) {
            return refreshAccessToken().then(newToken => {
                if (newToken) {
                    config.headers['Authorization'] = `Bearer ${newToken}`;
                }
                return config;
            });
        } else {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Response interceptor ile token yenileme
api.interceptors.response.use(response => {
    return response;
}, async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            return api(originalRequest);
        }
    }
    return Promise.reject(error);
});

// Access token'ın süresini kontrol eden fonksiyon
function isTokenExpired(token) {
    if (!token) return true;

    const decoded = jwtDecode(token);
    const currentTimeInSeconds = Date.now() / 1000;

    // Token'ın geçerliliği currentTimeInSeconds zamanına göre kontrol edilir
    return decoded.exp < currentTimeInSeconds;
}

function isRefreshTokenExpired(token) {
    if (!token) return true;

    const decoded = jwtDecode(token);
    const currentTimeInSeconds = Date.now() / 1000;

    // Token'ın geçerliliği currentTimeInSeconds zamanına göre kontrol edilir
    return decoded.exp < currentTimeInSeconds;
}

// isTokenExpired fonksiyonunu export et
api.isTokenExpired = isTokenExpired;

api.isRefreshTokenExpired = isRefreshTokenExpired;

api.refreshAccessToken = refreshAccessToken;

export default api;
