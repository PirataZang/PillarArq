import Company from '#models/company'
import type { Infer } from '@vinejs/vine/types'
import type { createCompanyValidator } from '#validators/company_validator'

type CreateCompanyPayload = Infer<typeof createCompanyValidator>

export default class CompanyService {
  /**
   * Criação de nova empresa.
   * Normalmente, este endpoint será utilizado por um SuperAdmin ou em processo de Sign Up.
   */
  async store(payload: CreateCompanyPayload) {
    return Company.create(payload)
  }
}
