import Project from '#models/project'
import ProjectPhase from '#models/project_phase'
import Client from '#models/client'
import Company from '#models/company'
import LimitException from '#exceptions/limit_exception'
import { DateTime } from 'luxon'
import type { Infer } from '@vinejs/vine/types'
import type { createProjectValidator, updateProjectValidator } from '#validators/project_validator'
import type { ProjectListFilters } from '#models/project'
import { DEFAULT_PROJECT_STATUS } from '#constants/project_status'
import {
  resolveProjectPhaseSeeds,
  resolvePhaseTemplatesBySortOrder,
  applyPhaseTemplates,
  type PhaseTemplateSnapshot,
} from '#utils/company_phase_templates'
import {
  buildProjectBudgetSummary,
  calculateProgressPercentFromPhases,
} from '#utils/project_budget'
import { parseSqlDate } from '#utils/parse_sql_date'

type CreateProjectPayload = Infer<typeof createProjectValidator>
type UpdateProjectPayload = Infer<typeof updateProjectValidator>

export default class ProjectService {
  private activeQuery(companyId: string) {
    return Project.query().where('companyId', companyId).whereNot('status', 'ARCHIVED')
  }

  private async findProjectOrFail(companyId: string, projectId: string) {
    return Project.query().where('companyId', companyId).where('id', projectId).firstOrFail()
  }

  private async loadProjectDetails(project: Project) {
    await project.load('client')
    await project.load('assignedUser')
    await project.load('materials', (query) => query.orderBy('sortOrder', 'asc'))
    await project.load('expenses', (query) => query.orderBy('expenseDate', 'desc'))
    await project.load('phases', (query) => query.orderBy('sortOrder', 'asc'))
    await project.load('notes', (query) => {
      query.orderBy('createdAt', 'desc').preload('author')
    })

    return project
  }

  private serializeProject(project: Project) {
    const serialized = project.serialize()

    return {
      ...serialized,
      budget_summary: buildProjectBudgetSummary(project),
    }
  }

  private serializeProjectWithTemplates(
    project: Project,
    templatesBySortOrder: Map<number, PhaseTemplateSnapshot>
  ) {
    const serialized = this.serializeProject(project)
    const phases = applyPhaseTemplates(serialized.phases ?? [], templatesBySortOrder)

    return {
      ...serialized,
      phases,
      progress_percent: calculateProgressPercentFromPhases(phases),
    }
  }

  private async serializeProjectWithTemplatesForCompany(companyId: string, project: Project) {
    const templatesBySortOrder = await resolvePhaseTemplatesBySortOrder(companyId)
    return this.serializeProjectWithTemplates(project, templatesBySortOrder)
  }

  private serializeProjectListItem(
    project: Project,
    templatesBySortOrder: Map<number, PhaseTemplateSnapshot>
  ) {
    const serialized = project.serialize()
    const phases = applyPhaseTemplates(serialized.phases ?? [], templatesBySortOrder)

    return {
      id: serialized.id,
      name: serialized.name,
      status: serialized.status,
      area_m2: serialized.area_m2,
      progress_percent: calculateProgressPercentFromPhases(phases),
      start_date: serialized.start_date,
      expected_end_date: serialized.expected_end_date,
      client: serialized.client,
      phases,
      updated_at: serialized.updated_at,
    }
  }

  async index(companyId: string, filters: ProjectListFilters = {}) {
    const projects = await Project.scopeList(companyId, filters)
      .preload('client')
      .preload('phases', (query) => query.orderBy('sortOrder', 'asc'))
      .orderBy('updatedAt', 'desc')

    const templatesBySortOrder = await resolvePhaseTemplatesBySortOrder(companyId)

    return projects.map((project) => this.serializeProjectListItem(project, templatesBySortOrder))
  }

  async show(companyId: string, projectId: string) {
    const project = await this.findProjectOrFail(companyId, projectId)
    await this.loadProjectDetails(project)
    return this.serializeProjectWithTemplatesForCompany(companyId, project)
  }

  async store(companyId: string, payload: CreateProjectPayload, userId?: string) {
    await Client.query()
      .where('id', payload.client_id)
      .where('companyId', companyId)
      .whereNull('deletedAt')
      .firstOrFail()

    const status = payload.status || DEFAULT_PROJECT_STATUS
    if (status !== 'ARCHIVED') {
      const company = await Company.query().where('id', companyId).whereNull('deletedAt').firstOrFail()

      const currentActiveCount = await Project.query()
        .where('companyId', companyId)
        .whereNot('status', 'ARCHIVED')
        .count('* as total')
        .first()

      const activeTotal = Number(currentActiveCount?.$extras.total || 0)
      if (activeTotal >= company.maxProjects) {
        throw new LimitException(
          `Você atingiu o limite de obras ativas para sua empresa (máximo ${company.maxProjects}). Se desejar aumentar o limite, por favor entre em contato com o suporte.`
        )
      }
    }

    const project = await Project.create({
      companyId,
      clientId: payload.client_id,
      name: payload.name,
      description: payload.description ?? null,
      address: payload.address ?? null,
      areaM2: payload.area_m2,
      status: payload.status ?? DEFAULT_PROJECT_STATUS,
      serviceRateOverride: payload.service_rate_override ?? null,
      extraAmount: payload.extra_amount ?? 0,
      assignedUserId: payload.assigned_user_id ?? null,
      startDate: parseSqlDate(payload.start_date),
      expectedEndDate: parseSqlDate(payload.expected_end_date),
      createdBy: userId ?? null,
    })

    const phaseSeeds = await resolveProjectPhaseSeeds(companyId)

    const phases = await ProjectPhase.createMany(
      phaseSeeds.map((phase, index) => ({
        companyId,
        projectId: project.id,
        name: phase.name,
        description: phase.description,
        weightPercent: phase.weightPercent,
        isCompleted: index === 0,
        completedAt: index === 0 ? DateTime.now() : null,
        sortOrder: phase.sortOrder,
      }))
    )

    project.progressPercent = phases[0]?.weightPercent ?? 0
    await project.save()

    await this.loadProjectDetails(project)
    return this.serializeProjectWithTemplatesForCompany(companyId, project)
  }

  async update(companyId: string, projectId: string, payload: UpdateProjectPayload, userId?: string) {
    const project = await this.findProjectOrFail(companyId, projectId)

    if (payload.client_id) {
      await Client.query()
        .where('id', payload.client_id)
        .where('companyId', companyId)
        .whereNull('deletedAt')
        .firstOrFail()
    }

    if (project.status === 'ARCHIVED' && payload.status && payload.status !== 'ARCHIVED') {
      const company = await Company.query().where('id', companyId).whereNull('deletedAt').firstOrFail()

      const currentActiveCount = await Project.query()
        .where('companyId', companyId)
        .whereNot('status', 'ARCHIVED')
        .count('* as total')
        .first()

      const activeTotal = Number(currentActiveCount?.$extras.total || 0)
      if (activeTotal >= company.maxProjects) {
        throw new LimitException(
          `Você atingiu o limite de obras ativas para sua empresa (máximo ${company.maxProjects}). Se desejar aumentar o limite, por favor entre em contato com o suporte.`
        )
      }
    }

    const unarchiving =
      project.status === 'ARCHIVED' && payload.status !== undefined && payload.status !== 'ARCHIVED'

    const {
      client_id,
      area_m2,
      service_rate_override,
      extra_amount,
      assigned_user_id,
      start_date,
      expected_end_date,
      ...rest
    } = payload

    project.merge({
      ...rest,
      ...(client_id !== undefined ? { clientId: client_id } : {}),
      ...(area_m2 !== undefined ? { areaM2: area_m2 } : {}),
      ...(service_rate_override !== undefined
        ? { serviceRateOverride: service_rate_override }
        : {}),
      ...(extra_amount !== undefined ? { extraAmount: extra_amount } : {}),
      ...(assigned_user_id !== undefined ? { assignedUserId: assigned_user_id } : {}),
      ...(start_date !== undefined ? { startDate: parseSqlDate(start_date) } : {}),
      ...(expected_end_date !== undefined
        ? { expectedEndDate: parseSqlDate(expected_end_date) }
        : {}),
      ...(unarchiving ? { deletedAt: null } : {}),
      updatedBy: userId ?? null,
    })

    await project.save()
    await this.loadProjectDetails(project)
    return this.serializeProjectWithTemplatesForCompany(companyId, project)
  }

  async destroy(companyId: string, projectId: string, userId?: string) {
    const project = await this.activeQuery(companyId).where('id', projectId).firstOrFail()
    project.status = 'ARCHIVED'
    project.deletedAt = DateTime.now()
    project.updatedBy = userId ?? null
    await project.save()
  }

  async restore(companyId: string, projectId: string, userId?: string) {
    const project = await Project.query()
      .where('companyId', companyId)
      .where('id', projectId)
      .where('status', 'ARCHIVED')
      .firstOrFail()

    const company = await Company.query().where('id', companyId).whereNull('deletedAt').firstOrFail()

    const currentActiveCount = await Project.query()
      .where('companyId', companyId)
      .whereNot('status', 'ARCHIVED')
      .count('* as total')
      .first()

    const activeTotal = Number(currentActiveCount?.$extras.total || 0)
    if (activeTotal >= company.maxProjects) {
      throw new LimitException(
        `Você atingiu o limite de obras ativas para sua empresa (máximo ${company.maxProjects}). Se desejar aumentar o limite, por favor entre em contato com o suporte.`
      )
    }

    project.status = 'DRAFT'
    project.deletedAt = null
    project.updatedBy = userId ?? null
    await project.save()

    await this.loadProjectDetails(project)
    return this.serializeProjectWithTemplatesForCompany(companyId, project)
  }
}
