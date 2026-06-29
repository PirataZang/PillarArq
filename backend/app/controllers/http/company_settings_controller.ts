import type { HttpContext } from '@adonisjs/core/http'
import CompanyPhaseTemplateService from '#services/company_phase_template_service'
import {
  createCompanyPhaseTemplateValidator,
  updateCompanyPhaseTemplateValidator,
} from '#validators/company_settings_validator'
import User from '#models/user'

export default class CompanySettingsController {
  private templateService = new CompanyPhaseTemplateService()

  async listPhaseTemplates({ auth, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    const templates = await this.templateService.index(companyId)

    const totalWeight = templates.reduce((sum, template) => sum + template.weightPercent, 0)

    return response.ok({
      success: true,
      message: 'Phase templates listed successfully',
      data: {
        templates,
        total_weight_percent: totalWeight,
      },
    })
  }

  async storePhaseTemplate({ auth, request, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    const payload = await request.validateUsing(createCompanyPhaseTemplateValidator)
    const template = await this.templateService.store(companyId, payload)

    return response.created({
      success: true,
      message: 'Phase template created successfully',
      data: template,
    })
  }

  async updatePhaseTemplate({ auth, request, params, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    const payload = await request.validateUsing(updateCompanyPhaseTemplateValidator)
    const template = await this.templateService.update(companyId, params.id, payload)

    return response.ok({
      success: true,
      message: 'Phase template updated successfully',
      data: template,
    })
  }

  async destroyPhaseTemplate({ auth, params, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    await this.templateService.destroy(companyId, params.id)

    return response.ok({
      success: true,
      message: 'Phase template deleted successfully',
      data: {},
    })
  }
}
