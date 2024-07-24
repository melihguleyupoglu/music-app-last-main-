<template>
  <body :color-scheme="isDark ? 'dark' : 'light'">
    <div class="nav-div">
      <nav class="nav">
        <router-link class="logo-anchor" to="/">
          <img src="/public/favicon.ico" alt="" />
        </router-link>
        <input type="checkbox" id="darkmode-toggle" @click="toggleDark()" />
        <label for="darkmode-toggle" class="dark-label">
          <div class="indicator"></div>
        </label>
      </nav>
    </div>
  </body>
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark({
  selector: 'body',
  attribute: 'color-scheme',
  valueDark: 'dark',
  valueLight: 'light'
})

const toggleDark = useToggle(isDark)
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
  transition: background-color 0.3s ease; /* Smooth transition */
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.indicator {
  /* 'transform' özelliğini ayarlayın */
  transform: translateX(0);
  height: 26px;
  position: absolute;
  width: 26px;
  border: 1px solid #000000;
  border-radius: 20px;
  transition: transform 0.3s ease; /* 'transform' kullanın */
  left: 0;
}

#darkmode-toggle:checked ~ .dark-label .indicator {
  transform: translateX(140%);
}
</style>
