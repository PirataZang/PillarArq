import { BaseSchema } from '@adonisjs/lucid/schema'
import Company from '#models/company'
import { seedDefaultBudgetTemplate } from '#utils/default_budget_template'

export default class extends BaseSchema {
  async up() {
    const companies = await Company.query().whereNull('deletedAt')
    for (const company of companies) {
      await seedDefaultBudgetTemplate(String(company.id))
    }
  }

  async down() {
    // Templates podem ter sido editados; não remove automaticamente.
  }
}
