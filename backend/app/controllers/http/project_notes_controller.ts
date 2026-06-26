import type { HttpContext } from '@adonisjs/core/http'
import ProjectNoteService from '#services/project_note_service'
import { createProjectNoteValidator } from '#validators/project_validator'
import User from '#models/user'

export default class ProjectNotesController {
  private noteService = new ProjectNoteService()

  async index({ auth, params, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    const notes = await this.noteService.index(companyId, params.projectId)

    return response.ok({
      success: true,
      message: 'Project notes listed successfully',
      data: notes,
    })
  }

  async store({ auth, request, params, response }: HttpContext) {
    const user = auth.user as User
    const payload = await request.validateUsing(createProjectNoteValidator)
    const note = await this.noteService.store(
      user.companyId,
      params.projectId,
      payload.content,
      user.id
    )

    return response.created({
      success: true,
      message: 'Project note created successfully',
      data: note,
    })
  }

  async destroy({ auth, params, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    await this.noteService.destroy(companyId, params.projectId, params.id)

    return response.ok({
      success: true,
      message: 'Project note deleted successfully',
      data: {},
    })
  }
}
