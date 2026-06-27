import Company from '#models/company'
import type { Infer } from '@vinejs/vine/types'
import type { createCompanyValidator, updateCompanyValidator } from '#validators/company_validator'
import { DateTime } from 'luxon'

type CreateCompanyPayload = Infer<typeof createCompanyValidator>
type UpdateCompanyPayload = Infer<typeof updateCompanyValidator>

export default class CompanyService {
  async index() {
    return Company.query().whereNull('deletedAt').orderBy('name', 'asc')
  }

  async show(id: string) {
    return Company.query().where('id', id).whereNull('deletedAt').firstOrFail()
  }

  async store(payload: CreateCompanyPayload) {
    return Company.create({
      name: payload.name,
      slug: payload.slug,
      isActive: payload.is_active !== undefined ? !!payload.is_active : true,
      maxUsers: payload.max_users !== undefined ? payload.max_users : 5,
      maxProjects: payload.max_projects !== undefined ? payload.max_projects : 5
    })
  }

  async update(id: string, payload: UpdateCompanyPayload) {
    const company = await this.show(id)
    
    if (payload.name !== undefined) {
      company.name = payload.name
    }
    if (payload.slug !== undefined) {
      company.slug = payload.slug
    }
    if (payload.is_active !== undefined) {
      company.isActive = !!payload.is_active
    }
    if (payload.max_users !== undefined) {
      company.maxUsers = payload.max_users
    }
    if (payload.max_projects !== undefined) {
      company.maxProjects = payload.max_projects
    }
    
    await company.save()
    return company
  }

  async destroy(id: string) {
    const company = await this.show(id)
    company.isActive = false
    company.deletedAt = DateTime.now()
    await company.save()
    return company
  }
}
