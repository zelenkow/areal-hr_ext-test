import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { authApi } from '@/services/auth-api'

export const authGuard = async (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  if (to.path === '/') {
    return next()
  }

  try {
    await authApi.checkAuth()
    next()
  } catch {
    next('/')
  }
}
