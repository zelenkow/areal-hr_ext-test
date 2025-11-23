import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import OrganizationsView from '../views/OrganizationsView.vue'

const DepartmentsView = { template: '<div>Departments Page - Coming Soon</div>' }
const PositionsView = { template: '<div>Positions Page - Coming Soon</div>' }

const routes: RouteRecordRaw[] = [
  { 
    path: '/', 
    redirect: '/organizations'
  },
  { 
    path: '/organizations', 
    component: OrganizationsView,
    name: 'organizations'
  },
  { 
    path: '/departments', 
    component: DepartmentsView,
    name: 'departments' 
  },
  { 
    path: '/positions', 
    component: PositionsView,
    name: 'positions'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router