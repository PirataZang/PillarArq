import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

import AuthLayout from '@/layouts/AuthLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

import LoginPage from '@/pages/auth/LoginPage.vue'
import DashboardPage from '@/pages/dashboard/DashboardPage.vue'
import UserListPage from '@/pages/users/UserListPage.vue'
import UserFormPage from '@/pages/users/UserFormPage.vue'
import ClientListPage from '@/pages/clients/ClientListPage.vue'
import ClientFormPage from '@/pages/clients/ClientFormPage.vue'
import ProjectListPage from '@/pages/projects/ProjectListPage.vue'
import ProjectFormPage from '@/pages/projects/ProjectFormPage.vue'
import ProjectDetailPage from '@/pages/projects/ProjectDetailPage.vue'
import ComponentsTestPage from '@/pages/ComponentsTest.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'login',
        component: LoginPage,
        meta: { guest: true },
      },
    ],
  },
  {
    path: '/',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: DashboardPage,
      },
      {
        path: 'users',
        name: 'users.list',
        component: UserListPage,
      },
      {
        path: 'users/create',
        name: 'users.create',
        component: UserFormPage,
      },
      {
        path: 'users/:id',
        name: 'users.edit',
        component: UserFormPage,
      },
      {
        path: 'clients',
        name: 'clients.list',
        component: ClientListPage,
      },
      {
        path: 'clients/create',
        name: 'clients.create',
        component: ClientFormPage,
      },
      {
        path: 'clients/:id',
        name: 'clients.edit',
        component: ClientFormPage,
      },
      {
        path: 'projects',
        name: 'projects.list',
        component: ProjectListPage,
      },
      {
        path: 'projects/create',
        name: 'projects.create',
        component: ProjectFormPage,
      },
      {
        path: 'projects/:id/edit',
        name: 'projects.edit',
        component: ProjectFormPage,
      },
      {
        path: 'projects/:id',
        name: 'projects.detail',
        component: ProjectDetailPage,
      },
      {
        path: 'components-test',
        name: 'components.test',
        component: ComponentsTestPage,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth) {
    if (!authStore.user) {
      authStore.hydrateFromCookie()
    }

    if (!authStore.user || authStore.isUserExpired()) {
      authStore.clearSession()
      return { name: 'login' }
    }

    const valid = await authStore.validateSession()
    if (!valid) {
      return { name: 'login' }
    }
  }

  if (to.meta.guest) {
    if (!authStore.user) {
      authStore.hydrateFromCookie()
    }

    if (authStore.user && !authStore.isUserExpired()) {
      const valid = await authStore.validateSession()
      if (valid) {
        return { name: 'dashboard' }
      }
    }
  }
})

export default router
