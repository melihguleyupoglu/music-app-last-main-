<script setup lang="ts">
import axios from 'axios'
import Swal from 'sweetalert2'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import { useAuthStore } from '@/store/auth.ts'
// import api from '../src/services/api.js'
import { mainAuthStore } from './main'

// const authStore = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')

console.log(username, password)

const handleLogin = async (e) => {
  e.preventDefault()
  console.log(username, password)
  try {
    const response = await axios.post('http://localhost:3000/login', {
      username: username.value,
      password: password.value
    })
    console.log(response.data)
    if (response.status === 200) {
      router.push('/home')

      const accessToken = response.data.accessToken
      const refreshToken = response.data.refreshToken

      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('refresh_token', refreshToken)

      mainAuthStore.setAccessToken(accessToken)
      mainAuthStore.setRefreshToken(refreshToken)
    }
  } catch (err: any) {
    Swal.fire({
      icon: 'error',
      title: 'Oops',
      text: err
    })
    console.log(err)
  }
}
</script>

<template>
  <div class="form__container">
    <form action="" class="login-form" @submit="handleLogin($event)">
      <label for="username">Username:</label>
      <input type="text" v-model="username" id="username" required />
      <label for="password">Password:</label>
      <input type="password" v-model="password" id="password" required />
      <button class="submit-button">Login</button>
    </form>
  </div>
</template>

<style scoped>
.form__container {
  margin-top: 10%;
}

.login-form {
  display: flex;
  flex-direction: column;
  row-gap: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 0.5%;
}
input {
  margin-bottom: 0.5%;
}

.submit-button {
  height: 20px;
  width: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
