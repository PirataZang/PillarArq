import Project from '#models/project'
import ProjectPhase from '#models/project_phase'
import { DateTime } from 'luxon'
import type { Infer } from '@vinejs/vine/types'
import type { updateProjectPhaseValidator } from '#validators/project_validator'
import { calculateProgressPercent } from '#utils/project_budget'

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

    phase.isCompleted = payload.is_completed
    phase.completedAt = payload.is_completed ? DateTime.now() : null
    await phase.save()

    await project.load('phases')
    project.progressPercent = calculateProgressPercent(project)
    await project.save()

    return phase
  }
}
