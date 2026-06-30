import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Company from './company.js'
import Project from './project.js'
import { Auditable } from './mixins/auditable.js'

export default class Client extends Auditable(BaseModel) {
  @column({ isPrimary: true })
  declare id: string

  @column({ serializeAs: 'company_id' })
  declare companyId: string

  @column()
  declare name: string

  @column()
  declare email: string | null

  @column()
  declare phone: string | null

  @column()
  declare document: string | null

  @column()
  declare address: string | null

  @column({ columnName: 'service_rate_per_m2', serializeAs: 'service_rate_per_m2' })
  declare serviceRatePerM2: number

  @column()
  declare notes: string | null

  @column({ serializeAs: 'active' })
  declare isActive: boolean

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

  @hasMany(() => Project)
  declare projects: HasMany<typeof Project>
}
