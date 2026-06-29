import { DateTime } from 'luxon'
import Company from '#models/company'
import User from '#models/user'
import Client from '#models/client'
import Project from '#models/project'
import { buildProjectBudgetSummary } from '#utils/project_budget'
import { buildBudgetVariables, type BudgetVariableInput } from '#utils/budget_variables'
import type { ProjectStatus } from '#constants/project_status'

const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  DRAFT: 'Rascunho',
  BUDGETING: 'Orçamento',
  IN_PROGRESS: 'Em andamento',
  ON_HOLD: 'Pausado',
  COMPLETED: 'Concluído',
  ARCHIVED: 'Arquivado',
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatDate(value: DateTime | null | undefined): string {
  if (!value) return ''
  return value.toFormat('dd/MM/yyyy')
}

export interface DocumentVariableContextOptions {
  clientId?: number | string | null
  projectId?: number | string | null
  budgetData?: BudgetVariableInput | null
}

export async function buildDocumentVariableContext(
  companyId: string,
  userId: string,
  options: DocumentVariableContextOptions = {}
): Promise<Record<string, string>> {
  const company = await Company.query().where('id', companyId).whereNull('deletedAt').firstOrFail()
  const user = await User.query().where('id', userId).where('companyId', companyId).firstOrFail()

  let client: Client | null = null
  if (options.clientId) {
    client = await Client.query()
      .where('id', String(options.clientId))
      .where('companyId', companyId)
      .whereNull('deletedAt')
      .first()
  }

  let project: Project | null = null
  if (options.projectId) {
    project = await Project.query()
      .where('id', String(options.projectId))
      .where('companyId', companyId)
      .whereNull('deletedAt')
      .preload('client')
      .preload('materials')
      .preload('expenses')
      .first()

    if (project?.client && !client) {
      client = project.client
    }
  }

  const budget = project ? buildProjectBudgetSummary(project) : null
  const budgetVariables = options.budgetData ? buildBudgetVariables(options.budgetData) : {}

  return {
    'company.name': company.name ?? '',
    'company.document': '',
    'company.address': '',
    'user.name': user.name ?? '',
    'user.email': user.email ?? '',
    'user.phone': '',
    'client.name': client?.name ?? '',
    'client.email': client?.email ?? '',
    'client.phone': client?.phone ?? '',
    'client.document': client?.document ?? '',
    'client.address': client?.address ?? '',
    'project.name': project?.name ?? '',
    'project.address': project?.address ?? '',
    'project.status': project ? PROJECT_STATUS_LABELS[project.status] ?? project.status : '',
    'project.total_budget': budget ? formatCurrency(budget.budget_total) : '',
    'project.start_date': project ? formatDate(project.startDate) : '',
    'proposal.total': budget ? formatCurrency(budget.budget_total) : '',
    'proposal.date': formatDate(DateTime.now()),
    ...budgetVariables,
  }
}
