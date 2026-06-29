import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import type Project from '#models/project'
import type { ProjectStatus } from '#constants/project_status'

export interface ProjectListFilters {
  archived?: boolean
  search?: string
  status?: ProjectStatus
  client_id?: string
  assigned_user_id?: string
  start_date_from?: string
  start_date_to?: string
  expected_end_date_from?: string
  expected_end_date_to?: string
  progress_min?: number
  progress_max?: number
}

type ProjectQuery = ModelQueryBuilderContract<typeof Project>

export function applyProjectScopes(
  query: ProjectQuery,
  companyId: string,
  filters: ProjectListFilters = {}
) {
  query.where('companyId', companyId)

  if (filters.archived) {
    query.where('status', 'ARCHIVED')
  } else {
    query.whereNot('status', 'ARCHIVED')
  }

  if (filters.search?.trim()) {
    const term = `%${filters.search.trim()}%`
    query.where((builder) => {
      builder
        .whereILike('name', term)
        .orWhereILike('address', term)
        .orWhereILike('description', term)
        .orWhereHas('client', (clientQuery) => {
          clientQuery.whereILike('name', term)
        })
    })
  }

  if (filters.status) {
    query.where('status', filters.status)
  }

  if (filters.client_id) {
    query.where('clientId', filters.client_id)
  }

  if (filters.assigned_user_id) {
    query.where('assignedUserId', filters.assigned_user_id)
  }

  if (filters.start_date_from) {
    query.where('startDate', '>=', filters.start_date_from)
  }

  if (filters.start_date_to) {
    query.where('startDate', '<=', filters.start_date_to)
  }

  if (filters.expected_end_date_from) {
    query.where('expectedEndDate', '>=', filters.expected_end_date_from)
  }

  if (filters.expected_end_date_to) {
    query.where('expectedEndDate', '<=', filters.expected_end_date_to)
  }

  if (filters.progress_min !== undefined) {
    query.where('progressPercent', '>=', filters.progress_min)
  }

  if (filters.progress_max !== undefined) {
    query.where('progressPercent', '<=', filters.progress_max)
  }

  return query
}
