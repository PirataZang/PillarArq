import type { HttpContext } from '@adonisjs/core/http'
import CompanyService from '#services/company_service'
import { createCompanyValidator } from '#validators/company_validator'

export default class CompaniesController {
  private companyService = new CompanyService()

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createCompanyValidator)

    const company = await this.companyService.store(payload)

    return response.created({
      success: true,
      message: 'Empresa criada com sucesso',
      data: company
    })
  }
}
