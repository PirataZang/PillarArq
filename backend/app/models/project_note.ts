import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Project from './project.js'
import User from './user.js'

export default class ProjectNote extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column({ serializeAs: 'company_id' })
  declare companyId: string

  @column({ serializeAs: 'project_id' })
  declare projectId: string

  @column()
  declare content: string

  @column({ serializeAs: 'created_by' })
  declare createdBy: string | null

  @column.dateTime({ autoCreate: true, serializeAs: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updated_at' })
  declare updatedAt: DateTime

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>

  @belongsTo(() => User, { foreignKey: 'createdBy' })
  declare author: BelongsTo<typeof User>
}
