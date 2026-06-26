import type { HttpContext } from '@adonisjs/core/http'
import ProjectPhaseService from '#services/project_phase_service'
import { updateProjectPhaseValidator } from '#validators/project_validator'
import User from '#models/user'

export default class ProjectPhasesController {
  private phaseService = new ProjectPhaseService()

  async index({ auth, params, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    const phases = await this.phaseService.index(companyId, params.projectId)

    return response.ok({
      success: true,
      message: 'Project phases listed successfully',
      data: phases,
    })
  }

  async update({ auth, request, params, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    const payload = await request.validateUsing(updateProjectPhaseValidator)
    const phase = await this.phaseService.update(
      companyId,
      params.projectId,
      params.id,
      payload
    )

    return response.ok({
      success: true,
      message: 'Project phase updated successfully',
      data: phase,
    })
  }
}
