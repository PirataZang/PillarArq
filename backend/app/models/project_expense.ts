import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { ExpenseCategory } from '#constants/expense_category'
import Project from './project.js'

export default class ProjectExpense extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column({ serializeAs: 'company_id' })
  declare companyId: string

  @column({ serializeAs: 'project_id' })
  declare projectId: string

  @column.date({ serializeAs: 'expense_date' })
  declare expenseDate: DateTime

  @column()
  declare category: ExpenseCategory

  @column()
  declare description: string

  @column()
  declare amount: number

  @column.dateTime({ autoCreate: true, serializeAs: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updated_at' })
  declare updatedAt: DateTime

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>
}
