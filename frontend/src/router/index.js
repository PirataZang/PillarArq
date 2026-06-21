import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

import AuthLayout from '@/layouts/AuthLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

import LoginPage from '@/pages/auth/LoginPage.vue'
import DashboardPage from '@/pages/dashboard/DashboardPage.vue'
import UserListPage from '@/pages/users/UserListPage.vue'
import UserCreatePage from '@/pages/users/UserCreatePage.vue'
import UserEditPage from '@/pages/users/UserEditPage.vue'
import ComponentsTestPage from '@/pages/ComponentsTest.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'login',
        component: LoginPage,
        meta: { guest: true }
      }
    ]
  },
  {
    path: '/',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: DashboardPage
      },
      {
        path: 'users',
        name: 'users.list',
        component: UserListPage
      },
      {
        path: 'users/create',
        name: 'users.create',
        component: UserCreatePage
      },
      {
        path: 'users/:id/edit',
        name: 'users.edit',
        component: UserEditPage
      }
    ]
  },
  {
    path: '/components-test',
    name: 'components.test',
    component: ComponentsTestPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation Guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Requer autenticação e não está logado -> Login
    next({ name: 'login' })
  } else if (to.meta.guest && isAuthenticated) {
    // Rota só para convidados (login) mas já está logado -> Dashboard
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
