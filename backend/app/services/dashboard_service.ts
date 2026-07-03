import { DateTime } from 'luxon'
import Project from '#models/project'
import Client from '#models/client'
import { PROJECT_STATUSES, type ProjectStatus } from '#constants/project_status'
import {
  buildProjectBudgetSummary,
  calculateProgressPercentFromPhases,
} from '#utils/project_budget'
import {
  resolvePhaseTemplatesBySortOrder,
  applyPhaseTemplates,
} from '#utils/company_phase_templates'

export interface DashboardFilters {
  period_from: string
  period_to: string
  status?: ProjectStatus
}

const STATUS_LABELS: Record<ProjectStatus, string> = {
  DRAFT: 'Rascunho',
  BUDGETING: 'Orçamento',
  IN_PROGRESS: 'Em andamento',
  ON_HOLD: 'Pausada',
  COMPLETED: 'Concluída',
  ARCHIVED: 'Arquivada',
}

interface TimelineBucket {
  key: string
  label: string
  count: number
}

function resolvePeriod(filters: DashboardFilters) {
  const now = DateTime.now()

  return {
    from: DateTime.fromISO(filters.period_from ?? now.startOf('month').toISODate()!).startOf('day'),
    to: DateTime.fromISO(filters.period_to ?? now.toISODate()!).endOf('day'),
  }
}

function buildMonthlyTimeline(
  from: DateTime,
  to: DateTime,
  items: Array<{ createdAt: DateTime }>
): TimelineBucket[] {
  const months: TimelineBucket[] = []
  let cursor = from.startOf('month')
  const end = to.endOf('month')

  while (cursor <= end) {
    months.push({
      key: cursor.toFormat('yyyy-MM'),
      label: cursor.setLocale('pt-BR').toFormat('LLL/yy'),
      count: 0,
    })
    cursor = cursor.plus({ months: 1 })
  }

  for (const item of items) {
    const key = item.createdAt.toFormat('yyyy-MM')
    const bucket = months.find((month) => month.key === key)
    if (bucket) {
      bucket.count++
    }
  }

  return months
}

function average(values: number[]) {
  if (!values.length) {
    return 0
  }

  return values.reduce((total, value) => total + value, 0) / values.length
}

export default class DashboardService {
  async getStats(companyId: string, filters: DashboardFilters) {
    const { from, to } = resolvePeriod(filters)

    let projectsQuery = Project.query()
      .where('companyId', companyId)
      .where('createdAt', '>=', from.toSQL()!)
      .where('createdAt', '<=', to.toSQL()!)
      .whereNot('status', 'ARCHIVED')

    if (filters.status) {
      projectsQuery = projectsQuery.where('status', filters.status)
    }

    const projects = await projectsQuery
      .preload('client')
      .preload('materials')
      .preload('expenses')
      .preload('phases')
      .orderBy('createdAt', 'desc')

    const clients = await Client.query()
      .where('companyId', companyId)
      .whereNull('deletedAt')
      .where('createdAt', '>=', from.toSQL()!)
      .where('createdAt', '<=', to.toSQL()!)
      .orderBy('createdAt', 'asc')

    const templatesBySortOrder = await resolvePhaseTemplatesBySortOrder(companyId)

    const projectMetrics = projects.map((project) => {
      const budget = buildProjectBudgetSummary(project)
      const phases = applyPhaseTemplates(
        (project.phases ?? []).map((phase) => phase.serialize()),
        templatesBySortOrder
      )
      const progress = calculateProgressPercentFromPhases(phases)

      return {
        progress,
        budget_total: budget.budget_total,
        expenses_total: budget.expenses_total,
      }
    })

    const projectsByStatus = PROJECT_STATUSES.filter((status) => status !== 'ARCHIVED').map(
      (status) => ({
        status,
        label: STATUS_LABELS[status],
        count: projects.filter((project) => project.status === status).length,
      })
    )

    return {
      period: {
        from: from.toISODate()!,
        to: to.toISODate()!,
      },
      summary: {
        projects_count: projects.length,
        average_progress: Math.round(average(projectMetrics.map((item) => item.progress))),
        new_clients_count: clients.length,
        average_budget: average(projectMetrics.map((item) => item.budget_total)),
        average_expenses: average(projectMetrics.map((item) => item.expenses_total)),
      },
      projects_by_status: projectsByStatus,
      projects_timeline: buildMonthlyTimeline(from, to, projects),
      clients_timeline: buildMonthlyTimeline(from, to, clients),
      projects_progress: projects.slice(0, 12).map((project) => {
        const phases = applyPhaseTemplates(
          (project.phases ?? []).map((phase) => phase.serialize()),
          templatesBySortOrder
        )

        return {
          id: project.id,
          name: project.name,
          progress: calculateProgressPercentFromPhases(phases),
        }
      }),
    }
  }
}
