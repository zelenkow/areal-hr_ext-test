import type { LoginData, AuthResponse } from '@/types/auth'

export const authApi = {
  async login(loginData: LoginData): Promise<AuthResponse> {
    const response = await fetch(`api/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message)
    }

    return await response.json()
  },

  async logout(): Promise<void> {
    const response = await fetch(`api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    if (!response.ok) {
      throw new Error('Failed quit session')
    }
  },
}
