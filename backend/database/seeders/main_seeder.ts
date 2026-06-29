import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Company from '#models/company'
import User from '#models/user'
import { seedDefaultPhaseTemplates } from '#utils/company_phase_templates'
import { seedDefaultBudgetTemplate } from '#utils/default_budget_template'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method

    const adminCompany = await Company.create({
      name: 'Pillar Arq',
      slug: 'pillararq',
      isActive: true
    })

    await seedDefaultPhaseTemplates(adminCompany.id)
    await seedDefaultBudgetTemplate(adminCompany.id)

    await User.create({
      companyId: adminCompany.id,
      name: 'Administrador',
      email: 'admin@pillararq.com',
      password: 'admin123',
      role: 'ADMIN',
      isActive: true,
      isMaster: true
    })
  }
}
