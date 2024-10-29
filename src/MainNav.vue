<template>
  <body :color-scheme="uiStore.isDarkMode ? 'dark' : 'light'">
    <div class="nav-div">
      <nav class="nav" aria-label="Main Navigation">
        <router-link class="logo-anchor" to="/">
          <img class="logo__image" src="/public/cd.png" alt="Site Logo" />
        </router-link>
        <input
          tabindex="0"
          type="checkbox"
          id="darkmode-toggle"
          @click="uiStore.toggleDarkMode()"
          aria-label="Toggle Dark Mode"
          :aria-checked="uiStore.isDarkMode"
          role="switch"
        />
        <label
          for="darkmode-toggle"
          class="dark-label"
          aria-hidden="true"
          tabindex="0"
          @keydown.space.prevent="triggerToggle"
          @keydown.enter.prevent="triggerToggle"
        >
          <div class="indicator"></div>
        </label>
        <button class="logout__button" @click="logout" v-if="authenticated">Logout</button>
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
.logo__image {
  height: 60px;
  width: 60px;
}

.logo__image:hover {
  outline: 2px solid white;
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
  /* border-bottom: 2px solid black; */
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

#darkmode-toggle:checked ~ .dark-label .indicator {
  animation: moveRight 0.3s ease forwards;
}

#darkmode-toggle:not(:checked) ~ .dark-label .indicator {
  animation: moveLeft 0.3s ease forwards;
}

.logout__button {
  margin-right: 3%;
}
</style>
