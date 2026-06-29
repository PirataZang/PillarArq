import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useSwal } from '@/utils/swal'

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
import CompanyListPage from '@/pages/companies/CompanyListPage.vue'
import CompanyFormPage from '@/pages/companies/CompanyFormPage.vue'
import SettingsPage from '@/pages/settings/SettingsPage.vue'
import DocumentTemplateListPage from '@/pages/documents/DocumentTemplateListPage.vue'
import DocumentTemplateEditorPage from '@/pages/documents/DocumentTemplateEditorPage.vue'

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
        meta: { permission: 'user.list', title: 'Usuários' },
      },
      {
        path: 'users/create',
        name: 'users.create',
        component: UserFormPage,
        meta: { permission: 'user.create', title: 'Usuários' },
      },
      {
        path: 'users/:id',
        name: 'users.edit',
        component: UserFormPage,
        meta: { permission: 'user.update', title: 'Usuários' },
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
        meta: { permission: 'projects.list', title: 'Obras' },
      },
      {
        path: 'projects/create',
        name: 'projects.create',
        component: ProjectFormPage,
        meta: { permission: 'projects.create', title: 'Obras' },
      },
      {
        path: 'projects/:id/edit',
        name: 'projects.edit',
        component: ProjectFormPage,
        meta: { permission: 'projects.update', title: 'Obras' },
      },
      {
        path: 'projects/:id',
        name: 'projects.detail',
        component: ProjectDetailPage,
        meta: { permission: 'projects.list', title: 'Obras' },
      },
      {
        path: 'components-test',
        name: 'components.test',
        component: ComponentsTestPage,
      },
      {
        path: 'companies',
        name: 'companies.list',
        component: CompanyListPage,
        meta: { requiresMaster: true, title: 'Empresas' },
      },
      {
        path: 'companies/create',
        name: 'companies.create',
        component: CompanyFormPage,
        meta: { requiresMaster: true, title: 'Empresas' },
      },
      {
        path: 'companies/:id',
        name: 'companies.edit',
        component: CompanyFormPage,
        meta: { requiresMaster: true, title: 'Empresas' },
      },
      {
        path: 'settings',
        name: 'settings',
        component: SettingsPage,
        meta: { title: 'Configurações' },
      },
      {
        path: 'documents',
        name: 'documents.list',
        component: DocumentTemplateListPage,
        meta: { title: 'Documentos' },
      },
      {
        path: 'documents/create',
        name: 'documents.create',
        component: DocumentTemplateEditorPage,
        meta: { title: 'Documentos', fullWidth: true },
      },
      {
        path: 'documents/:id/edit',
        name: 'documents.edit',
        component: DocumentTemplateEditorPage,
        meta: { title: 'Documentos', fullWidth: true },
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

    if (to.meta.requiresMaster && !authStore.user?.is_master) {
      const swal = useSwal()
      swal.error('Acesso Negado', `Você não tem acesso à tela de ${to.meta.title || 'Empresas'}`)
      return { name: 'dashboard' }
    }

    if (to.meta.permission && !authStore.hasPermission(to.meta.permission)) {
      const swal = useSwal()
      swal.error('Acesso Negado', `Você não tem acesso à tela de ${to.meta.title || 'esta página'}`)
      return { name: 'dashboard' }
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
