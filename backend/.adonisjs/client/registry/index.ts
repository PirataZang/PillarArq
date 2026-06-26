/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.login': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.login']['types'],
  },
  'auth.refresh': {
    methods: ["POST"],
    pattern: '/api/v1/auth/refresh',
    tokens: [{"old":"/api/v1/auth/refresh","type":0,"val":"api","end":""},{"old":"/api/v1/auth/refresh","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/refresh","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/refresh","type":0,"val":"refresh","end":""}],
    types: placeholder as Registry['auth.refresh']['types'],
  },
  'companies.store': {
    methods: ["POST"],
    pattern: '/api/v1/companies',
    tokens: [{"old":"/api/v1/companies","type":0,"val":"api","end":""},{"old":"/api/v1/companies","type":0,"val":"v1","end":""},{"old":"/api/v1/companies","type":0,"val":"companies","end":""}],
    types: placeholder as Registry['companies.store']['types'],
  },
  'auth.logout': {
    methods: ["POST"],
    pattern: '/api/v1/auth/logout',
    tokens: [{"old":"/api/v1/auth/logout","type":0,"val":"api","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['auth.logout']['types'],
  },
  'auth.me': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/auth/me',
    tokens: [{"old":"/api/v1/auth/me","type":0,"val":"api","end":""},{"old":"/api/v1/auth/me","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/me","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/me","type":0,"val":"me","end":""}],
    types: placeholder as Registry['auth.me']['types'],
  },
  'users.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/users',
    tokens: [{"old":"/api/v1/users","type":0,"val":"api","end":""},{"old":"/api/v1/users","type":0,"val":"v1","end":""},{"old":"/api/v1/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.index']['types'],
  },
  'users.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/users/:id',
    tokens: [{"old":"/api/v1/users/:id","type":0,"val":"api","end":""},{"old":"/api/v1/users/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/users/:id","type":0,"val":"users","end":""},{"old":"/api/v1/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.show']['types'],
  },
  'users.store': {
    methods: ["POST"],
    pattern: '/api/v1/users',
    tokens: [{"old":"/api/v1/users","type":0,"val":"api","end":""},{"old":"/api/v1/users","type":0,"val":"v1","end":""},{"old":"/api/v1/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.store']['types'],
  },
  'users.update': {
    methods: ["PUT"],
    pattern: '/api/v1/users/:id',
    tokens: [{"old":"/api/v1/users/:id","type":0,"val":"api","end":""},{"old":"/api/v1/users/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/users/:id","type":0,"val":"users","end":""},{"old":"/api/v1/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.update']['types'],
  },
  'users.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/users/:id',
    tokens: [{"old":"/api/v1/users/:id","type":0,"val":"api","end":""},{"old":"/api/v1/users/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/users/:id","type":0,"val":"users","end":""},{"old":"/api/v1/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.destroy']['types'],
  },
  'clients.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/clients',
    tokens: [{"old":"/api/v1/clients","type":0,"val":"api","end":""},{"old":"/api/v1/clients","type":0,"val":"v1","end":""},{"old":"/api/v1/clients","type":0,"val":"clients","end":""}],
    types: placeholder as Registry['clients.index']['types'],
  },
  'clients.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/clients/:id',
    tokens: [{"old":"/api/v1/clients/:id","type":0,"val":"api","end":""},{"old":"/api/v1/clients/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/clients/:id","type":0,"val":"clients","end":""},{"old":"/api/v1/clients/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['clients.show']['types'],
  },
  'clients.store': {
    methods: ["POST"],
    pattern: '/api/v1/clients',
    tokens: [{"old":"/api/v1/clients","type":0,"val":"api","end":""},{"old":"/api/v1/clients","type":0,"val":"v1","end":""},{"old":"/api/v1/clients","type":0,"val":"clients","end":""}],
    types: placeholder as Registry['clients.store']['types'],
  },
  'clients.update': {
    methods: ["PUT"],
    pattern: '/api/v1/clients/:id',
    tokens: [{"old":"/api/v1/clients/:id","type":0,"val":"api","end":""},{"old":"/api/v1/clients/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/clients/:id","type":0,"val":"clients","end":""},{"old":"/api/v1/clients/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['clients.update']['types'],
  },
  'clients.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/clients/:id',
    tokens: [{"old":"/api/v1/clients/:id","type":0,"val":"api","end":""},{"old":"/api/v1/clients/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/clients/:id","type":0,"val":"clients","end":""},{"old":"/api/v1/clients/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['clients.destroy']['types'],
  },
  'projects.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/projects',
    tokens: [{"old":"/api/v1/projects","type":0,"val":"api","end":""},{"old":"/api/v1/projects","type":0,"val":"v1","end":""},{"old":"/api/v1/projects","type":0,"val":"projects","end":""}],
    types: placeholder as Registry['projects.index']['types'],
  },
  'projects.store': {
    methods: ["POST"],
    pattern: '/api/v1/projects',
    tokens: [{"old":"/api/v1/projects","type":0,"val":"api","end":""},{"old":"/api/v1/projects","type":0,"val":"v1","end":""},{"old":"/api/v1/projects","type":0,"val":"projects","end":""}],
    types: placeholder as Registry['projects.store']['types'],
  },
  'project_materials.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/projects/:projectId/materials',
    tokens: [{"old":"/api/v1/projects/:projectId/materials","type":0,"val":"api","end":""},{"old":"/api/v1/projects/:projectId/materials","type":0,"val":"v1","end":""},{"old":"/api/v1/projects/:projectId/materials","type":0,"val":"projects","end":""},{"old":"/api/v1/projects/:projectId/materials","type":1,"val":"projectId","end":""},{"old":"/api/v1/projects/:projectId/materials","type":0,"val":"materials","end":""}],
    types: placeholder as Registry['project_materials.index']['types'],
  },
  'project_materials.store': {
    methods: ["POST"],
    pattern: '/api/v1/projects/:projectId/materials',
    tokens: [{"old":"/api/v1/projects/:projectId/materials","type":0,"val":"api","end":""},{"old":"/api/v1/projects/:projectId/materials","type":0,"val":"v1","end":""},{"old":"/api/v1/projects/:projectId/materials","type":0,"val":"projects","end":""},{"old":"/api/v1/projects/:projectId/materials","type":1,"val":"projectId","end":""},{"old":"/api/v1/projects/:projectId/materials","type":0,"val":"materials","end":""}],
    types: placeholder as Registry['project_materials.store']['types'],
  },
  'project_materials.update': {
    methods: ["PUT"],
    pattern: '/api/v1/projects/:projectId/materials/:id',
    tokens: [{"old":"/api/v1/projects/:projectId/materials/:id","type":0,"val":"api","end":""},{"old":"/api/v1/projects/:projectId/materials/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/projects/:projectId/materials/:id","type":0,"val":"projects","end":""},{"old":"/api/v1/projects/:projectId/materials/:id","type":1,"val":"projectId","end":""},{"old":"/api/v1/projects/:projectId/materials/:id","type":0,"val":"materials","end":""},{"old":"/api/v1/projects/:projectId/materials/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['project_materials.update']['types'],
  },
  'project_materials.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/projects/:projectId/materials/:id',
    tokens: [{"old":"/api/v1/projects/:projectId/materials/:id","type":0,"val":"api","end":""},{"old":"/api/v1/projects/:projectId/materials/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/projects/:projectId/materials/:id","type":0,"val":"projects","end":""},{"old":"/api/v1/projects/:projectId/materials/:id","type":1,"val":"projectId","end":""},{"old":"/api/v1/projects/:projectId/materials/:id","type":0,"val":"materials","end":""},{"old":"/api/v1/projects/:projectId/materials/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['project_materials.destroy']['types'],
  },
  'project_expenses.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/projects/:projectId/expenses',
    tokens: [{"old":"/api/v1/projects/:projectId/expenses","type":0,"val":"api","end":""},{"old":"/api/v1/projects/:projectId/expenses","type":0,"val":"v1","end":""},{"old":"/api/v1/projects/:projectId/expenses","type":0,"val":"projects","end":""},{"old":"/api/v1/projects/:projectId/expenses","type":1,"val":"projectId","end":""},{"old":"/api/v1/projects/:projectId/expenses","type":0,"val":"expenses","end":""}],
    types: placeholder as Registry['project_expenses.index']['types'],
  },
  'project_expenses.store': {
    methods: ["POST"],
    pattern: '/api/v1/projects/:projectId/expenses',
    tokens: [{"old":"/api/v1/projects/:projectId/expenses","type":0,"val":"api","end":""},{"old":"/api/v1/projects/:projectId/expenses","type":0,"val":"v1","end":""},{"old":"/api/v1/projects/:projectId/expenses","type":0,"val":"projects","end":""},{"old":"/api/v1/projects/:projectId/expenses","type":1,"val":"projectId","end":""},{"old":"/api/v1/projects/:projectId/expenses","type":0,"val":"expenses","end":""}],
    types: placeholder as Registry['project_expenses.store']['types'],
  },
  'project_expenses.update': {
    methods: ["PUT"],
    pattern: '/api/v1/projects/:projectId/expenses/:id',
    tokens: [{"old":"/api/v1/projects/:projectId/expenses/:id","type":0,"val":"api","end":""},{"old":"/api/v1/projects/:projectId/expenses/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/projects/:projectId/expenses/:id","type":0,"val":"projects","end":""},{"old":"/api/v1/projects/:projectId/expenses/:id","type":1,"val":"projectId","end":""},{"old":"/api/v1/projects/:projectId/expenses/:id","type":0,"val":"expenses","end":""},{"old":"/api/v1/projects/:projectId/expenses/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['project_expenses.update']['types'],
  },
  'project_expenses.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/projects/:projectId/expenses/:id',
    tokens: [{"old":"/api/v1/projects/:projectId/expenses/:id","type":0,"val":"api","end":""},{"old":"/api/v1/projects/:projectId/expenses/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/projects/:projectId/expenses/:id","type":0,"val":"projects","end":""},{"old":"/api/v1/projects/:projectId/expenses/:id","type":1,"val":"projectId","end":""},{"old":"/api/v1/projects/:projectId/expenses/:id","type":0,"val":"expenses","end":""},{"old":"/api/v1/projects/:projectId/expenses/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['project_expenses.destroy']['types'],
  },
  'project_phases.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/projects/:projectId/phases',
    tokens: [{"old":"/api/v1/projects/:projectId/phases","type":0,"val":"api","end":""},{"old":"/api/v1/projects/:projectId/phases","type":0,"val":"v1","end":""},{"old":"/api/v1/projects/:projectId/phases","type":0,"val":"projects","end":""},{"old":"/api/v1/projects/:projectId/phases","type":1,"val":"projectId","end":""},{"old":"/api/v1/projects/:projectId/phases","type":0,"val":"phases","end":""}],
    types: placeholder as Registry['project_phases.index']['types'],
  },
  'project_phases.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/projects/:projectId/phases/:id',
    tokens: [{"old":"/api/v1/projects/:projectId/phases/:id","type":0,"val":"api","end":""},{"old":"/api/v1/projects/:projectId/phases/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/projects/:projectId/phases/:id","type":0,"val":"projects","end":""},{"old":"/api/v1/projects/:projectId/phases/:id","type":1,"val":"projectId","end":""},{"old":"/api/v1/projects/:projectId/phases/:id","type":0,"val":"phases","end":""},{"old":"/api/v1/projects/:projectId/phases/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['project_phases.update']['types'],
  },
  'project_notes.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/projects/:projectId/notes',
    tokens: [{"old":"/api/v1/projects/:projectId/notes","type":0,"val":"api","end":""},{"old":"/api/v1/projects/:projectId/notes","type":0,"val":"v1","end":""},{"old":"/api/v1/projects/:projectId/notes","type":0,"val":"projects","end":""},{"old":"/api/v1/projects/:projectId/notes","type":1,"val":"projectId","end":""},{"old":"/api/v1/projects/:projectId/notes","type":0,"val":"notes","end":""}],
    types: placeholder as Registry['project_notes.index']['types'],
  },
  'project_notes.store': {
    methods: ["POST"],
    pattern: '/api/v1/projects/:projectId/notes',
    tokens: [{"old":"/api/v1/projects/:projectId/notes","type":0,"val":"api","end":""},{"old":"/api/v1/projects/:projectId/notes","type":0,"val":"v1","end":""},{"old":"/api/v1/projects/:projectId/notes","type":0,"val":"projects","end":""},{"old":"/api/v1/projects/:projectId/notes","type":1,"val":"projectId","end":""},{"old":"/api/v1/projects/:projectId/notes","type":0,"val":"notes","end":""}],
    types: placeholder as Registry['project_notes.store']['types'],
  },
  'project_notes.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/projects/:projectId/notes/:id',
    tokens: [{"old":"/api/v1/projects/:projectId/notes/:id","type":0,"val":"api","end":""},{"old":"/api/v1/projects/:projectId/notes/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/projects/:projectId/notes/:id","type":0,"val":"projects","end":""},{"old":"/api/v1/projects/:projectId/notes/:id","type":1,"val":"projectId","end":""},{"old":"/api/v1/projects/:projectId/notes/:id","type":0,"val":"notes","end":""},{"old":"/api/v1/projects/:projectId/notes/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['project_notes.destroy']['types'],
  },
  'projects.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/projects/:id',
    tokens: [{"old":"/api/v1/projects/:id","type":0,"val":"api","end":""},{"old":"/api/v1/projects/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/projects/:id","type":0,"val":"projects","end":""},{"old":"/api/v1/projects/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projects.show']['types'],
  },
  'projects.update': {
    methods: ["PUT"],
    pattern: '/api/v1/projects/:id',
    tokens: [{"old":"/api/v1/projects/:id","type":0,"val":"api","end":""},{"old":"/api/v1/projects/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/projects/:id","type":0,"val":"projects","end":""},{"old":"/api/v1/projects/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projects.update']['types'],
  },
  'projects.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/projects/:id',
    tokens: [{"old":"/api/v1/projects/:id","type":0,"val":"api","end":""},{"old":"/api/v1/projects/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/projects/:id","type":0,"val":"projects","end":""},{"old":"/api/v1/projects/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projects.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
