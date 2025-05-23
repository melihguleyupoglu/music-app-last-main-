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
  if (passwordError) {
    Swal.fire({
      icon: 'error',
      title: 'Oops',
      text: passwordError
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const response = await handleSignup()
}

const handleSignup = async () => {
  try {
    const response = await axios.post('http://localhost:3000/signup', {
      username: username.value,
      email: email.value,
      password: password.value
    })

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
      aria-labelledby="signup-form-heading"
    >
      <h2 id="signup-form-heading" class="sr-only">Signup Form</h2>

      <label for="email" class="generic-label">Email:</label>
      <input
        class="generic-input"
        type="text"
        v-model="email"
        id="email"
        required
        aria-required="true"
        aria-label="Enter your username"
      />
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
        aria-describedby="password-requirements"
      />
      <div id="password-requirements" class="sr-only">
        Your password must be at least 8 characters long.
      </div>

      <label for="passwordTwo" class="generic-label">Confirm your password:</label>
      <input
        class="generic-input"
        type="password"
        v-model="passwordTwo"
        id="passwordTwo"
        required
        aria-required="true"
        aria-label="Re-enter your password"
        aria-describedby="password-match"
      />
      <div id="password-match" class="sr-only">Ensure the passwords match.</div>
      <button type="submit" aria-label="Create your account." class="generic-button submit-button">
        Create your account
      </button>
    </form>
  </div>
</template>

<style scoped>
.form__container {
  margin-top: 5%;
}

.signup-form {
  display: flex;
  flex-direction: column;
  row-gap: 100%;
  justify-content: center;
  align-items: center;
}

input {
  margin-bottom: 0.5%;
  text-align: center;
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

input {
  margin-bottom: 0.5%;
}

.submit-button {
  margin-top: 1rem;
  height: 4rem;
  width: 6rem;
  font-size: large;
  font-weight: 400;
}

@media screen and (max-height: 540) {
  .form__container {
    max-height: 10vh;
    margin-top: auto;
  }
}

@media screen and(max-height:410) {
  .form__container {
    max-height: 5vh;
    margin-top: auto;
  }
}
</style>
