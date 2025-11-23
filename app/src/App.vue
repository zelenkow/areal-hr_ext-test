<template>
  <div id="app">
    <h1>Кадровый учет</h1>
    
    <nav>
      <router-link to="/organizations">
        Организации
      </router-link> |
      <router-link to="/departments">
        Отделы
      </router-link> |
      <router-link to="/positions">
        Должности
      </router-link>
    </nav>
    
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

nav {
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 2rem;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin: 0 10px;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>