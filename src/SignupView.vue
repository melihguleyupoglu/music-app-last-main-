<script setup>
import { ref } from 'vue'
import Swal from 'sweetalert2'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')
const email = ref('')

const password = ref('')
const passwordTwo = ref('')

const validateUserCredentials = async (e, email, username, password, passwordTwo) => {
  e.preventDefault()
  const emailError = validateEmail(email)
  const usernameError = validateUsername(username)
  const passwordError = validatePassword(password)
  if (emailError) {
    Swal.fire({
      icon: 'error',
      title: 'Oops',
      text: emailError
    })
    return
  }

  if (usernameError) {
    Swal.fire({
      icon: 'error',
      title: 'Oops',
      text: usernameError
    })
    return
  }
  if (password !== passwordTwo) {
    Swal.fire({
      icon: 'error',
      title: 'Oops',
      text: 'Passwords are not matching.'
    })
    return
  }
  if (passwordError) {
    Swal.fire({
      icon: 'error',
      title: 'Oops',
      text: passwordError
    })
    return
  }
  const response = await handleSignup()
  console.log(response)
}

const validateEmail = (email) => {
  // eslint-disable-next-line no-useless-escape
  const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
  if (!re.test(String(email).toLowerCase())) {
    return 'Invalid email address.'
  }
  return ''
}

const validateUsername = (username) => {
  const re = /^[a-zA-Z0-9_.-]*$/g
  if (username.length < 3 || username.length > 15) {
    return 'Username must be between 3-15 characters.'
  }
  if (!re.test(username)) {
    return 'Username can only contain letters, numbers, and the characters _, ., -'
  }
  return ''
}

const validatePassword = (password) => {
  if (password.length < 8) {
    return 'Password should include at least 8 characters'
  }
  if (!/[a-z]/.test(password)) {
    return 'Password should include at least one lowercase letter'
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password should include at least one uppercase letter'
  }
  if (!/[0-9]/.test(password)) {
    return 'Password should include at least one number'
  }
  return ''
}

const handleSignup = async () => {
  console.log(username, email, password)
  try {
    const response = await axios.post('http://localhost:3000/signup', {
      username: username.value,
      email: email.value,
      password: password.value
    })
    console.log(response)
    if (response.status === 200) {
      Swal.fire({
        title: 'Succesful',
        text: 'Your account has been created succesfully',
        icon: 'success',
        confirmButtonText: 'OK'
      })
      router.push('/login')
    } else if (response.status === 202) {
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: 'Email already existing in system.'
      })
    } else if (response.status === 204) {
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: 'Username has already taken.'
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: 'Something went wrong'
      })
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops',
      text: error
    })
  }
}
</script>

<template>
  <div class="form__container">
    <form
      action=""
      class="signup-form"
      @submit="validateUserCredentials($event, email, username, password, passwordTwo)"
    >
      <label for="email">email</label>
      <input type="text" v-model="email" id="email" required />
      <label for="username">Username:</label>
      <input type="text" v-model="username" id="username" required />
      <label for="password">Password:</label>
      <input type="password" v-model="password" id="password" required />
      <label for="password">Confirm your password:</label>
      <input type="password" v-model="passwordTwo" id="passwordTwo" required />
      <button class="create-acc-button">Create your account</button>
    </form>
  </div>
</template>

<style scoped>
.form__container {
  margin-top: 10%;
}

.signup-form {
  display: flex;
  flex-direction: column;
  row-gap: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 0.5%;
}

input {
  margin-bottom: 0.5%;
  text-align: center;
}

.create-acc-button {
  height: 30px;
  width: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
