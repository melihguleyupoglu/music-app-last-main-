<template>
  <body :color-scheme="uiStore.isDarkMode ? 'dark' : 'light'">
    <div class="nav-div">
      <nav class="nav" aria-label="Main Navigation">
        <header class="main-header">
          <router-link class="logo-anchor" to="/">
            <h1 class="logo-header">
              <span class="header-span">The</span>
              <span class="header-span">Music</span>
              <span class="header-span">App</span>
            </h1>
          </router-link>
        </header>
        <!-- <button class="generic-button" @click="logout" v-if="authenticated">Logout</button> -->
      </nav>
    </div>
  </body>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { uiStore } from './main'
import { useRouter } from 'vue-router'
import { authenticated } from './main'

const router = useRouter()
const navbar = ref<HTMLElement | null>(null)

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
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.main-header {
  width: 100%;
}

.logo-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0rem;
  color: white;
  font-size: xx-large;
}

.logo-anchor {
  text-decoration: none;
}

.header-span {
  font-weight: 1000;
  margin-top: -1%;
}

.logo-svg {
  height: 4rem;
  width: 4rem;
}

.logo-svg:hover {
  outline: 2px solid white;
  border-radius: 2rem;
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

.button-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 0;
  gap: 0px;
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
</style>
