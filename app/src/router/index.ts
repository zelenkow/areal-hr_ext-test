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
  ],
})
export default router
