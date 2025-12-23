<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Вход в систему</h1>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="login" class="form-label">Логин</label>
          <input
            id="login"
            type="text"
            v-model="credentials.login"
            :class="{ 'input-error': showErrors && !credentials.login.trim() }"
            placeholder="Введите логин"
            class="form-input"
          />
          <span
            v-if="showErrors && !credentials.login.trim()"
            class="error-text"
          >
            Логин обязателен
          </span>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Пароль</label>
          <input
            id="password"
            type="password"
            v-model="credentials.password"
            :class="{ 'input-error': showErrors && !credentials.password.trim() }"
            placeholder="Введите пароль"
            class="form-input"
          />
          <span
            v-if="showErrors && !credentials.password.trim()"
            class="error-text"
          >
            Пароль обязателен
          </span>
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div class="form-actions">
          <AppButton
            type="submit"
            variant="primary"
            class="login-button"
          >
            Войти
          </AppButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LoginData } from '@/types/auth'

import { authApi } from '@/services/auth-api'

import AppButton from '@/components/AppButton.vue'

import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const credentials = ref<LoginData>({
  login: '',
  password: '',
})

const showErrors = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  showErrors.value = true
  errorMessage.value = ''

  if (!credentials.value.login.trim() || !credentials.value.password.trim()) {
    errorMessage.value = 'Заполните все поля'
    return
  }

  try {
    await authApi.login(credentials.value)

    window.dispatchEvent(new CustomEvent('auth-changed', {
      detail: true
    }))

    router.push('/organizations')

  } catch (error) {
      if (error instanceof Error) {
      errorMessage.value = error.message
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.login-title {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  font-size: 1.8rem;
  font-weight: 600;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.0rem;
}

.form-input {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.input-error {
  border-color: #e74c3c;
}

.error-text {
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 4px;
}

.error-message {
  background-color: #fee;
  border: 1px solid #fcc;
  color: #c00;
  padding: 12px;
  border-radius: 6px;
  font-size: 0.9rem;
}

.form-actions {
  margin-top: 20px;
}

.login-button {
  width: 100%;
  padding: 14px;
  font-size: 1rem;
}
</style>
