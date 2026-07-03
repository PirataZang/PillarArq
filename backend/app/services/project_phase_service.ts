import Project from '#models/project'
import ProjectPhase from '#models/project_phase'
import { DateTime } from 'luxon'
import type { Infer } from '@vinejs/vine/types'
import type { updateProjectPhaseValidator } from '#validators/project_validator'
import { calculateProgressPercentFromPhases } from '#utils/project_budget'
import {
  resolvePhaseTemplatesBySortOrder,
  applyPhaseTemplates,
} from '#utils/company_phase_templates'

type UpdatePayload = Infer<typeof updateProjectPhaseValidator>

export default class ProjectPhaseService {
  private async ensureProject(companyId: string, projectId: string) {
    return Project.query()
      .where('id', projectId)
      .where('companyId', companyId)
      .whereNull('deletedAt')
      .firstOrFail()
  }

  async index(companyId: string, projectId: string) {
    await this.ensureProject(companyId, projectId)

    return ProjectPhase.query()
      .where('companyId', companyId)
      .where('projectId', projectId)
      .orderBy('sortOrder', 'asc')
  }

  async update(
    companyId: string,
    projectId: string,
    phaseId: string,
    payload: UpdatePayload
  ) {
    const project = await this.ensureProject(companyId, projectId)

    const phase = await ProjectPhase.query()
      .where('id', phaseId)
      .where('projectId', projectId)
      .where('companyId', companyId)
      .firstOrFail()

    const phases = await ProjectPhase.query()
      .where('projectId', projectId)
      .where('companyId', companyId)
      .orderBy('sortOrder', 'asc')

    const completedAt = DateTime.now()

    for (const item of phases) {
      item.isCompleted = payload.is_completed && item.id === phase.id
      item.completedAt = item.isCompleted ? completedAt : null
      await item.save()
    }

    await project.load('phases')
    const templatesBySortOrder = await resolvePhaseTemplatesBySortOrder(companyId)
    const enrichedPhases = applyPhaseTemplates(
      project.phases.map((item) => item.serialize()),
      templatesBySortOrder
    )
    project.progressPercent = calculateProgressPercentFromPhases(enrichedPhases)
    await project.save()

    return phases.find((item) => item.id === phase.id) ?? phase
  }
}
