<template>
  <body :color-scheme="uiStore.isDarkMode ? 'dark' : 'light'">
    <div class="nav-div">
      <nav class="nav">
        <router-link class="logo-anchor" to="/">
          <img src="/public/favicon.ico" alt="" />
        </router-link>
        <input type="checkbox" id="darkmode-toggle" @click="uiStore.toggleDarkMode()" />
        <label for="darkmode-toggle" class="dark-label">
          <div class="indicator"></div>
        </label>
      </nav>
    </div>
  </body>
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { onMounted, onUnmounted, ref } from 'vue'
import { useUiStore } from './store/uiStore'

const navbar = ref<HTMLElement | null>(null)
const uiStore = useUiStore()

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

// const isDark = useDark({
//   selector: 'body',
//   attribute: 'color-scheme',
//   valueDark: 'dark',
//   valueLight: 'light'
// })

// const toggleDark = useToggle(isDark)

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
#darkmode-toggle {
  width: 0px;
  height: 0px;
  visibility: hidden;
  margin-right: 50%;
}

.dark-label {
  height: 30px;
  width: 65px;
  border: 1px solid black;
  border-radius: 200px;
  display: inline-block;
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
  background-color: #000000;
  border-bottom: 2px solid black;
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
</style>
