<template>
  <div id="app">
    <nav class="main-nav">
      <router-link to="/organizations" class="nav-link"> Организации </router-link>
      <router-link to="/departments" class="nav-link"> Отделы </router-link>
      <router-link to="/positions" class="nav-link"> Должности </router-link>
      <router-link to="/users" class="nav-link"> Пользователи </router-link>
      <router-link to="/employees" class="nav-link"> Сотрудники </router-link>

    </nav>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  margin: 0;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.main-nav {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #2c3e50;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background: #f8f9fa;
}

.nav-link.router-link-active {
  background: #42b983;
  color: white;
}

.main-content {
  padding: 20px;
}
</style>
