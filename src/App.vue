<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
