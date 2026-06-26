/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'auth.login': {
    methods: ["POST"]
    pattern: '/api/v1/auth/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth_validator').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth_validator').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/auth_controller').default['login']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/auth_controller').default['login']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.refresh': {
    methods: ["POST"]
    pattern: '/api/v1/auth/refresh'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth_validator').refreshTokenValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth_validator').refreshTokenValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/auth_controller').default['refresh']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/auth_controller').default['refresh']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'companies.store': {
    methods: ["POST"]
    pattern: '/api/v1/companies'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/company_validator').createCompanyValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/company_validator').createCompanyValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/companies_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/companies_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.logout': {
    methods: ["POST"]
    pattern: '/api/v1/auth/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/auth_controller').default['logout']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/auth_controller').default['logout']>>>
    }
  }
  'auth.me': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/auth/me'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/auth_controller').default['me']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/auth_controller').default['me']>>>
    }
  }
  'users.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/users_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/users_controller').default['index']>>>
    }
  }
  'users.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/users_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/users_controller').default['show']>>>
    }
  }
  'users.store': {
    methods: ["POST"]
    pattern: '/api/v1/users'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user_validator').createUserValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user_validator').createUserValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/users_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/users_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'users.update': {
    methods: ["PUT"]
    pattern: '/api/v1/users/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user_validator').updateUserValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/user_validator').updateUserValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/users_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/users_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'users.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/users_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/users_controller').default['destroy']>>>
    }
  }
  'clients.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/clients'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/clients_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/clients_controller').default['index']>>>
    }
  }
  'clients.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/clients/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/clients_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/clients_controller').default['show']>>>
    }
  }
  'clients.store': {
    methods: ["POST"]
    pattern: '/api/v1/clients'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/client_validator').createClientValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/client_validator').createClientValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/clients_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/clients_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'clients.update': {
    methods: ["PUT"]
    pattern: '/api/v1/clients/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/client_validator').updateClientValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/client_validator').updateClientValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/clients_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/clients_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'clients.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/clients/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/clients_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/clients_controller').default['destroy']>>>
    }
  }
  'projects.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/projects'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/projects_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/projects_controller').default['index']>>>
    }
  }
  'projects.store': {
    methods: ["POST"]
    pattern: '/api/v1/projects'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/project_validator').createProjectValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/project_validator').createProjectValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/projects_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/projects_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'project_materials.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/projects/:projectId/materials'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { projectId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/project_materials_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/project_materials_controller').default['index']>>>
    }
  }
  'project_materials.store': {
    methods: ["POST"]
    pattern: '/api/v1/projects/:projectId/materials'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/project_validator').createProjectMaterialValidator)>>
      paramsTuple: [ParamValue]
      params: { projectId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/project_validator').createProjectMaterialValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/project_materials_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/project_materials_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'project_materials.update': {
    methods: ["PUT"]
    pattern: '/api/v1/projects/:projectId/materials/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/project_validator').updateProjectMaterialValidator)>>
      paramsTuple: [ParamValue, ParamValue]
      params: { projectId: ParamValue; id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/project_validator').updateProjectMaterialValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/project_materials_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/project_materials_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'project_materials.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/projects/:projectId/materials/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { projectId: ParamValue; id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/project_materials_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/project_materials_controller').default['destroy']>>>
    }
  }
  'project_expenses.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/projects/:projectId/expenses'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { projectId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/project_expenses_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/project_expenses_controller').default['index']>>>
    }
  }
  'project_expenses.store': {
    methods: ["POST"]
    pattern: '/api/v1/projects/:projectId/expenses'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/project_validator').createProjectExpenseValidator)>>
      paramsTuple: [ParamValue]
      params: { projectId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/project_validator').createProjectExpenseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/project_expenses_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/project_expenses_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'project_expenses.update': {
    methods: ["PUT"]
    pattern: '/api/v1/projects/:projectId/expenses/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/project_validator').updateProjectExpenseValidator)>>
      paramsTuple: [ParamValue, ParamValue]
      params: { projectId: ParamValue; id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/project_validator').updateProjectExpenseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/project_expenses_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/project_expenses_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'project_expenses.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/projects/:projectId/expenses/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { projectId: ParamValue; id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/project_expenses_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/project_expenses_controller').default['destroy']>>>
    }
  }
  'project_phases.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/projects/:projectId/phases'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { projectId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/project_phases_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/project_phases_controller').default['index']>>>
    }
  }
  'project_phases.update': {
    methods: ["PATCH"]
    pattern: '/api/v1/projects/:projectId/phases/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/project_validator').updateProjectPhaseValidator)>>
      paramsTuple: [ParamValue, ParamValue]
      params: { projectId: ParamValue; id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/project_validator').updateProjectPhaseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/project_phases_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/project_phases_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'project_notes.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/projects/:projectId/notes'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { projectId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/project_notes_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/project_notes_controller').default['index']>>>
    }
  }
  'project_notes.store': {
    methods: ["POST"]
    pattern: '/api/v1/projects/:projectId/notes'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/project_validator').createProjectNoteValidator)>>
      paramsTuple: [ParamValue]
      params: { projectId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/project_validator').createProjectNoteValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/project_notes_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/project_notes_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'project_notes.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/projects/:projectId/notes/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { projectId: ParamValue; id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/project_notes_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/project_notes_controller').default['destroy']>>>
    }
  }
  'projects.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/projects/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/projects_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/projects_controller').default['show']>>>
    }
  }
  'projects.update': {
    methods: ["PUT"]
    pattern: '/api/v1/projects/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/project_validator').updateProjectValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/project_validator').updateProjectValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/projects_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/projects_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'projects.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/projects/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/http/projects_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/http/projects_controller').default['destroy']>>>
    }
  }
}
