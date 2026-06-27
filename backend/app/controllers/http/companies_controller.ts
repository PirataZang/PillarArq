import type { HttpContext } from '@adonisjs/core/http'
import CompanyService from '#services/company_service'
import { createCompanyValidator, updateCompanyValidator } from '#validators/company_validator'

export default class CompaniesController {
  private companyService = new CompanyService()

  async index({ response }: HttpContext) {
    const companies = await this.companyService.index()
    return response.ok({
      success: true,
      message: 'Empresas recuperadas com sucesso',
      data: companies
    })
  }

  async show({ params, response }: HttpContext) {
    const company = await this.companyService.show(params.id)
    return response.ok({
      success: true,
      message: 'Empresa recuperada com sucesso',
      data: company
    })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createCompanyValidator)
    const company = await this.companyService.store(payload)

    return response.created({
      success: true,
      message: 'Empresa criada com sucesso',
      data: company
    })
  }

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateCompanyValidator)
    const company = await this.companyService.update(params.id, payload)

    return response.ok({
      success: true,
      message: 'Empresa atualizada com sucesso',
      data: company
    })
  }

  async destroy({ params, response }: HttpContext) {
    await this.companyService.destroy(params.id)

    return response.ok({
      success: true,
      message: 'Empresa excluída com sucesso',
      data: null
    })
  }
}
