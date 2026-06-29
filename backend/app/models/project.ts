import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import type { ProjectStatus } from '#constants/project_status'
import Company from './company.js'
import Client from './client.js'
import User from './user.js'
import ProjectMaterial from './project_material.js'
import ProjectExpense from './project_expense.js'
import ProjectPhase from './project_phase.js'
import ProjectNote from './project_note.js'
import { applyProjectScopes, type ProjectListFilters } from './scopes/project_scopes.js'

export type { ProjectListFilters }

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column({ serializeAs: 'company_id' })
  declare companyId: string

  @column({ serializeAs: 'client_id' })
  declare clientId: string

  @column({ serializeAs: 'assigned_user_id' })
  declare assignedUserId: string | null

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare address: string | null

  @column({ columnName: 'area_m2', serializeAs: 'area_m2' })
  declare areaM2: number

  @column()
  declare status: ProjectStatus

  @column({ serializeAs: 'service_rate_override' })
  declare serviceRateOverride: number | null

  @column({ serializeAs: 'extra_amount' })
  declare extraAmount: number

  @column({ serializeAs: 'progress_percent' })
  declare progressPercent: number

  @column.date({ serializeAs: 'start_date' })
  declare startDate: DateTime | null

  @column.date({ serializeAs: 'expected_end_date' })
  declare expectedEndDate: DateTime | null

  @column({ serializeAs: 'created_by' })
  declare createdBy: string | null

  @column({ serializeAs: 'updated_by' })
  declare updatedBy: string | null

  @column.dateTime({ autoCreate: true, serializeAs: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updated_at' })
  declare updatedAt: DateTime

  @column.dateTime({ serializeAs: 'deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => Company)
  declare company: BelongsTo<typeof Company>

  @belongsTo(() => Client)
  declare client: BelongsTo<typeof Client>

  @belongsTo(() => User, { foreignKey: 'assignedUserId' })
  declare assignedUser: BelongsTo<typeof User>

  @hasMany(() => ProjectMaterial)
  declare materials: HasMany<typeof ProjectMaterial>

  @hasMany(() => ProjectExpense)
  declare expenses: HasMany<typeof ProjectExpense>

  @hasMany(() => ProjectPhase)
  declare phases: HasMany<typeof ProjectPhase>

  @hasMany(() => ProjectNote)
  declare notes: HasMany<typeof ProjectNote>

  static scopeList(companyId: string, filters: ProjectListFilters = {}) {
    const query = this.query()
    return applyProjectScopes(query, companyId, filters)
  }

  static scopeActive(companyId: string) {
    return this.query().where('companyId', companyId).whereNot('status', 'ARCHIVED')
  }

  static scopeArchived(companyId: string) {
    return this.query().where('companyId', companyId).where('status', 'ARCHIVED')
  }
}
