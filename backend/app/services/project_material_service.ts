import Project from '#models/project'
import ProjectMaterial from '#models/project_material'
import type { Infer } from '@vinejs/vine/types'
import type {
  createProjectMaterialValidator,
  updateProjectMaterialValidator,
} from '#validators/project_validator'

type CreatePayload = Infer<typeof createProjectMaterialValidator>
type UpdatePayload = Infer<typeof updateProjectMaterialValidator>

export default class ProjectMaterialService {
  private async ensureProject(companyId: string, projectId: string) {
    return Project.query()
      .where('id', projectId)
      .where('companyId', companyId)
      .whereNull('deletedAt')
      .firstOrFail()
  }

  async index(companyId: string, projectId: string) {
    await this.ensureProject(companyId, projectId)

    return ProjectMaterial.query()
      .where('companyId', companyId)
      .where('projectId', projectId)
      .orderBy('sortOrder', 'asc')
  }

  async store(companyId: string, projectId: string, payload: CreatePayload) {
    await this.ensureProject(companyId, projectId)

    return ProjectMaterial.create({
      companyId,
      projectId,
      name: payload.name,
      quantity: payload.quantity,
      unit: payload.unit,
      unitPrice: payload.unit_price,
      supplier: payload.supplier ?? null,
      sortOrder: payload.sort_order ?? 0,
    })
  }

  async update(
    companyId: string,
    projectId: string,
    materialId: string,
    payload: UpdatePayload
  ) {
    const material = await ProjectMaterial.query()
      .where('id', materialId)
      .where('projectId', projectId)
      .where('companyId', companyId)
      .firstOrFail()

    const { unit_price, sort_order, ...rest } = payload

    material.merge({
      ...rest,
      ...(unit_price !== undefined ? { unitPrice: unit_price } : {}),
      ...(sort_order !== undefined ? { sortOrder: sort_order } : {}),
    })

    await material.save()
    return material
  }

  async destroy(companyId: string, projectId: string, materialId: string) {
    const material = await ProjectMaterial.query()
      .where('id', materialId)
      .where('projectId', projectId)
      .where('companyId', companyId)
      .firstOrFail()

    await material.delete()
  }
}
