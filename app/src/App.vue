<template>
  <div id="app">
    <nav v-if="isAuthenticated" class="main-nav">
      <router-link to="/organizations" class="nav-link"> Организации </router-link>
      <router-link to="/departments" class="nav-link"> Отделы </router-link>
      <router-link to="/positions" class="nav-link"> Должности </router-link>
      <router-link v-if="user?.role === 'admin'" to="/users" class="nav-link"> Пользователи </router-link>
      <router-link to="/employees" class="nav-link"> Сотрудники </router-link>
      <router-link v-if="user?.role === 'admin'" to="/audit_logs" class="nav-link"> Логи </router-link>

      <AppButton
        variant="danger"
        @click="handleLogout"
        class="logout-btn"
      >
        Выйти
      </AppButton>

    </nav>

    <main class="main-content">
      <RouterView/>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { authApi } from '@/services/auth-api'
import { ref, onMounted, onUnmounted } from 'vue'

import type { AuthResponse } from '@/types/auth'

import AppButton from '@/components/AppButton.vue'

const router = useRouter()
const isAuthenticated = ref(false)
const user = ref<AuthResponse | null>(null)

onMounted(() => {
  checkAuth()
  window.addEventListener('auth-changed', handleAuthChange)
})

onUnmounted(() => {
  window.removeEventListener('auth-changed', handleAuthChange)
})

const checkAuth = async () => {
  try {
    const userData = await authApi.checkAuth()
    isAuthenticated.value = true
    user.value = userData
  } catch {
    isAuthenticated.value = false
    user.value = null
  }
}

const handleAuthChange = async (event: Event) => {
  const customEvent = event as CustomEvent<boolean>

  if (customEvent.detail) {
    await checkAuth()
  } else {
    isAuthenticated.value = false
    user.value = null
  }
}

const handleLogout = async () => {
  await authApi.logout()
  window.dispatchEvent(new CustomEvent('auth-changed', {
    detail: false
  }))
  user.value = null
  router.push('/')
}
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

.logout-btn {
  margin-left: auto;
}

.main-content {
  padding: 20px;
}
</style>
