import CompanyPhaseTemplate from '#models/company_phase_template'
import type { Infer } from '@vinejs/vine/types'
import type {
  createCompanyPhaseTemplateValidator,
  updateCompanyPhaseTemplateValidator,
} from '#validators/company_settings_validator'

type CreatePayload = Infer<typeof createCompanyPhaseTemplateValidator>
type UpdatePayload = Infer<typeof updateCompanyPhaseTemplateValidator>

export default class CompanyPhaseTemplateService {
  private async findOrFail(companyId: string, templateId: string) {
    return CompanyPhaseTemplate.query()
      .where('id', templateId)
      .where('companyId', companyId)
      .firstOrFail()
  }

  private async nextSortOrder(companyId: string) {
    const latest = await CompanyPhaseTemplate.query()
      .where('companyId', companyId)
      .orderBy('sortOrder', 'desc')
      .first()

    return latest ? latest.sortOrder + 1 : 1
  }

  async index(companyId: string) {
    return CompanyPhaseTemplate.query().where('companyId', companyId).orderBy('sortOrder', 'asc')
  }

  async store(companyId: string, payload: CreatePayload) {
    const sortOrder = payload.sort_order ?? (await this.nextSortOrder(companyId))

    return CompanyPhaseTemplate.create({
      companyId,
      name: payload.name,
      description: payload.description ?? null,
      weightPercent: payload.weight_percent,
      color: payload.color ?? '#5c5852',
      sortOrder,
    })
  }

  async update(companyId: string, templateId: string, payload: UpdatePayload) {
    const template = await this.findOrFail(companyId, templateId)

    const { weight_percent, sort_order, ...rest } = payload

    template.merge({
      ...rest,
      ...(weight_percent !== undefined ? { weightPercent: weight_percent } : {}),
      ...(sort_order !== undefined ? { sortOrder: sort_order } : {}),
    })

    await template.save()
    return template
  }

  async destroy(companyId: string, templateId: string) {
    const template = await this.findOrFail(companyId, templateId)
    await template.delete()
  }
}
