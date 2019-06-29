<template>
  <div id="app">
    <Projects></Projects>
  </div>
</template>

<script>
import Projects from './components/Projects.vue'

export default {
  name: 'app',
  components: {
    Projects
  }
}
</script>

<style>
body {
  position: relative;
  width: 100%;
  margin: 0; padding: 0;
} #app {
  font-family: "Bungee";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
} img {
  position: absolute;
  top: 0; left: 0;
  padding: 0;
} h2 {
  cursor: pointer;
}
</style>
