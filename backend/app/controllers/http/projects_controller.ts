import type { HttpContext } from '@adonisjs/core/http'
import ProjectService from '#services/project_service'
import { createProjectValidator, updateProjectValidator } from '#validators/project_validator'
import User from '#models/user'

export default class ProjectsController {
  private projectService = new ProjectService()

  async index({ auth, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    const projects = await this.projectService.index(companyId)

    return response.ok({
      success: true,
      message: 'Projects listed successfully',
      data: projects,
    })
  }

  async show({ auth, params, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    const project = await this.projectService.show(companyId, params.id)

    return response.ok({
      success: true,
      message: 'Project retrieved successfully',
      data: project,
    })
  }

  async store({ auth, request, response }: HttpContext) {
    const user = auth.user as User
    const payload = await request.validateUsing(createProjectValidator)
    const project = await this.projectService.store(user.companyId, payload, user.id)

    return response.created({
      success: true,
      message: 'Project created successfully',
      data: project,
    })
  }

  async update({ auth, request, params, response }: HttpContext) {
    const user = auth.user as User
    const payload = await request.validateUsing(updateProjectValidator)
    const project = await this.projectService.update(
      user.companyId,
      params.id,
      payload,
      user.id
    )

    return response.ok({
      success: true,
      message: 'Project updated successfully',
      data: project,
    })
  }

  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.user as User
    await this.projectService.destroy(user.companyId, params.id, user.id)

    return response.ok({
      success: true,
      message: 'Project archived successfully',
      data: {},
    })
  }
}
