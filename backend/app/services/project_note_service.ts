import Project from '#models/project'
import ProjectNote from '#models/project_note'

export default class ProjectNoteService {
  private async ensureProject(companyId: string, projectId: string) {
    return Project.query()
      .where('id', projectId)
      .where('companyId', companyId)
      .whereNull('deletedAt')
      .firstOrFail()
  }

  async index(companyId: string, projectId: string) {
    await this.ensureProject(companyId, projectId)

    return ProjectNote.query()
      .where('companyId', companyId)
      .where('projectId', projectId)
      .preload('author')
      .orderBy('createdAt', 'desc')
  }

  async store(companyId: string, projectId: string, content: string, userId?: string) {
    await this.ensureProject(companyId, projectId)

    const note = await ProjectNote.create({
      companyId,
      projectId,
      content,
      createdBy: userId ?? null,
    })

    await note.load('author')
    return note
  }

  async destroy(companyId: string, projectId: string, noteId: string) {
    const note = await ProjectNote.query()
      .where('id', noteId)
      .where('projectId', projectId)
      .where('companyId', companyId)
      .firstOrFail()

    await note.delete()
  }
}
