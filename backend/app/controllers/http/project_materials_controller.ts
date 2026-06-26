import type { HttpContext } from '@adonisjs/core/http'
import ProjectMaterialService from '#services/project_material_service'
import {
  createProjectMaterialValidator,
  updateProjectMaterialValidator,
} from '#validators/project_validator'
import User from '#models/user'

export default class ProjectMaterialsController {
  private materialService = new ProjectMaterialService()

  async index({ auth, params, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    const materials = await this.materialService.index(companyId, params.projectId)

    return response.ok({
      success: true,
      message: 'Project materials listed successfully',
      data: materials,
    })
  }

  async store({ auth, request, params, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    const payload = await request.validateUsing(createProjectMaterialValidator)
    const material = await this.materialService.store(companyId, params.projectId, payload)

    return response.created({
      success: true,
      message: 'Project material created successfully',
      data: material,
    })
  }

  async update({ auth, request, params, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    const payload = await request.validateUsing(updateProjectMaterialValidator)
    const material = await this.materialService.update(
      companyId,
      params.projectId,
      params.id,
      payload
    )

    return response.ok({
      success: true,
      message: 'Project material updated successfully',
      data: material,
    })
  }

  async destroy({ auth, params, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    await this.materialService.destroy(companyId, params.projectId, params.id)

    return response.ok({
      success: true,
      message: 'Project material deleted successfully',
      data: {},
    })
  }
}
