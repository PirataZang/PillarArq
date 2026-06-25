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
