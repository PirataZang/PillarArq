import Company from '#models/company'

export default class CompanyService {
  /**
   * Criação de nova empresa.
   * Normalmente, este endpoint será utilizado por um SuperAdmin ou em processo de Sign Up.
   */
  async store(payload: any) {
    return Company.create(payload)
  }
}
