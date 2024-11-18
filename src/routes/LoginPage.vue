<script setup lang="ts">
import axios from 'axios'
import Swal from 'sweetalert2'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')
const password = ref('')

const handleLogin = async (e: Event) => {
  e.preventDefault()
  try {
    const response = await axios.post('http://localhost:3000/login', {
      username: username.value,
      password: password.value
    })

    if (response.status === 200) {
      router.push('/home')
    }
  } catch (err: any) {
    Swal.fire({
      icon: 'error',
      title: 'Oops',
      text: err
    })
  }
}
</script>

<template>
  <div class="form__container">
    <form
      action=""
      class="login-form"
      @submit="handleLogin($event)"
      role="form"
      aria-labelledby="loginFormTitle"
    >
      <h1 id="loginFormTitle" class="sr-only">Login Form</h1>
      <label for="username" class="generic-label">Username:</label>
      <input
        class="generic-input"
        type="text"
        v-model="username"
        id="username"
        required
        aria-required="true"
        aria-label="Enter your username"
      />
      <label for="password" class="generic-label">Password:</label>
      <input
        class="generic-input"
        type="password"
        v-model="password"
        id="password"
        required
        aria-required="true"
        aria-label="Enter your password"
      />
      <button type="submit" class="generic-button login-button" aria-label="Login to your account">
        Login
      </button>
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

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.login-button {
  font-size: large;
  height: 3rem;
  width: 5rem;
  font-weight: 400;
}
</style>
