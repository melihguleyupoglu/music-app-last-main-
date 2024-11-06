<template>
  <body :color-scheme="uiStore.isDarkMode ? 'dark' : 'light'">
    <div class="nav-div">
      <nav class="nav" aria-label="Main Navigation">
        <router-link class="logo-anchor" to="/">
          <h1 class="logo-header">The Music App</h1>
        </router-link>
        <div class="ops-subnav">
          <button class="dark-button" v-on:click="uiStore.toggleDarkMode">
            <svg
              v-if="!isDarkMode"
              class="dark-svg"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              style="fill: rgba(0, 0, 0, 1)"
            >
              <path
                d="M12 11.807A9.002 9.002 0 0 1 10.049 2a9.942 9.942 0 0 0-5.12 2.735c-3.905 3.905-3.905 10.237 0 14.142 3.906 3.906 10.237 3.905 14.143 0a9.946 9.946 0 0 0 2.735-5.119A9.003 9.003 0 0 1 12 11.807z"
              ></path>
            </svg>
            <svg
              v-if="isDarkMode"
              class="light-svg"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              style="fill: rgba(0, 0, 0, 1)"
            >
              <path
                d="M6.993 12c0 2.761 2.246 5.007 5.007 5.007s5.007-2.246 5.007-5.007S14.761 6.993 12 6.993 6.993 9.239 6.993 12zM12 8.993c1.658 0 3.007 1.349 3.007 3.007S13.658 15.007 12 15.007 8.993 13.658 8.993 12 10.342 8.993 12 8.993zM10.998 19h2v3h-2zm0-17h2v3h-2zm-9 9h3v2h-3zm17 0h3v2h-3zM4.219 18.363l2.12-2.122 1.415 1.414-2.12 2.122zM16.24 6.344l2.122-2.122 1.414 1.414-2.122 2.122zM6.342 7.759 4.22 5.637l1.415-1.414 2.12 2.122zm13.434 10.605-1.414 1.414-2.122-2.122 1.414-1.414z"
              ></path>
            </svg>
          </button>
          <!-- <button
            class="light-button"
            v-if="isDarkMode"
            v-on:click="uiStore.toggleDarkMode"
          ></button> -->
          <button class="generic-button" @click="logout" v-if="authenticated">Logout</button>
        </div>
      </nav>
    </div>
  </body>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { uiStore } from './main'
import { useRouter } from 'vue-router'
import { authenticated } from './main'

const isDarkMode = ref(uiStore.isDarkMode)
const router = useRouter()
const navbar = ref<HTMLElement | null>(null)

watchEffect(() => {
  isDarkMode.value = uiStore.isDarkMode
})

const stickyNavbar = () => {
  if (navbar.value) {
    const top = navbar.value.offsetTop
    if (window.scrollY >= top + 1) {
      navbar.value.classList.add('sticky')
    } else {
      navbar.value.classList.remove('sticky')
    }
  }
}

const logout = async () => {
  try {
    await fetch('http://localhost:3000/logout', {
      method: 'POST',
      credentials: 'include'
    })
    authenticated.value = false
    router.push('/login')
  } catch (error) {
    console.error('Error during logout', error)
  }
}

const triggerToggle = () => {
  document.getElementById('darkmode-toggle')?.click()
}

onMounted(() => {
  navbar.value = document.querySelector('.nav')
  uiStore.applyDarkMode()
  window.addEventListener('scroll', stickyNavbar)
})

onUnmounted(() => {
  window.removeEventListener('scroll', stickyNavbar)
})
</script>

<style scoped>
.nav {
  padding-top: 1rem;
  display: grid;
  grid-template-columns: 75% 25%;
  align-items: center;
  justify-content: center;
}

.logo-anchor {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  font-size: x-large;
  width: 20rem;
}

.logo-header {
  color: white;
}

.logo-header:hover {
  outline: 2px solid white;
}

.ops-subnav {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

#darkmode-toggle {
  width: 0px;
  height: 0px;
  visibility: hidden;
  /* margin-right: 50%; */
}

.dark-label {
  height: 30px;
  width: 65px;
  border: 1px solid black;
  border-radius: 200px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  position: relative;
}

.dark-label:hover {
  outline: 2px solid white;
}

.indicator {
  height: 26px;
  width: 26px;
  border: 1px solid #000000;
  border-radius: 20px;
  position: absolute;
  transition: background-color 0.3s ease;
  background-color: #ffffff;
  transform: translateX(0);
}

.sticky {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
}

.generic-button {
  height: 2rem;
  width: 4rem;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: medium;
  margin-right: 5%;
}
.generic-button:hover {
  border-radius: 2rem;
}

#darkmode-toggle:checked ~ .dark-label .indicator {
  animation: moveRight 0.3s ease forwards;
}

#darkmode-toggle:not(:checked) ~ .dark-label .indicator {
  animation: moveLeft 0.3s ease forwards;
}

.logout__button {
  margin-right: 3%;
}

@keyframes moveRight {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(35px);
  }
}

@keyframes moveLeft {
  from {
    transform: translateX(35px);
  }
  to {
    transform: translateX(0);
  }
}

.dark-button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2rem;
  width: 2rem;
  border-color: white;
  background-color: white;
  border-radius: 100px;
}

.light-svg,
.dark-svg {
  size: 1rem;
}
</style>
