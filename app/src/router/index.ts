import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
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
export default router
