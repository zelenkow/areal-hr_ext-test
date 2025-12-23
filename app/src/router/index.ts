import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from './auth.guard'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/organizations',
      name: 'organizations',
      component: () => import('@/views/Organizations.vue'),
    },
    {
      path: '/departments',
      name: 'departments',
      component: () => import('@/views/Departments.vue'),
    },
    {
      path: '/positions',
      name: 'positions',
      component: () => import('@/views/Positions.vue'),
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/views/Users.vue'),
    },
    {
      path: '/employees',
      name: 'employees',
      component: () => import('@/views/Employees.vue'),
    },
    {
      path: '/employees/:id',
      name: 'employee-detail',
      component: () => import('@/views/EmployeeDetailView.vue'),
    },
  ],
})

router.beforeEach(authGuard)

export default router
