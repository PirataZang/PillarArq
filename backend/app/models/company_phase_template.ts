import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Company from './company.js'
import { Auditable } from './mixins/auditable.js'

export default class CompanyPhaseTemplate extends Auditable(BaseModel) {
  @column({ isPrimary: true })
  declare id: string

  @column({ serializeAs: 'company_id' })
  declare companyId: string

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column({ serializeAs: 'weight_percent' })
  declare weightPercent: number

  @column()
  declare color: string

  @column({ serializeAs: 'sort_order' })
  declare sortOrder: number

  @column.dateTime({ autoCreate: true, serializeAs: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updated_at' })
  declare updatedAt: DateTime

  @belongsTo(() => Company)
  declare company: BelongsTo<typeof Company>
}
