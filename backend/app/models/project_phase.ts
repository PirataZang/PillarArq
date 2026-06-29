import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Project from './project.js'

export default class ProjectPhase extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column({ serializeAs: 'company_id' })
  declare companyId: string

  @column({ serializeAs: 'project_id' })
  declare projectId: string

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column({ serializeAs: 'weight_percent' })
  declare weightPercent: number

  @column({ serializeAs: 'is_completed' })
  declare isCompleted: boolean

  @column.dateTime({ serializeAs: 'completed_at' })
  declare completedAt: DateTime | null

  @column({ serializeAs: 'sort_order' })
  declare sortOrder: number

  @column.dateTime({ autoCreate: true, serializeAs: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updated_at' })
  declare updatedAt: DateTime

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>
}
