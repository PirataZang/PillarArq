import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, computed } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Project from './project.js'
import { Auditable } from './mixins/auditable.js'

export default class ProjectMaterial extends Auditable(BaseModel) {
  @column({ isPrimary: true })
  declare id: string

  @column({ serializeAs: 'company_id' })
  declare companyId: string

  @column({ serializeAs: 'project_id' })
  declare projectId: string

  @column()
  declare name: string

  @column()
  declare quantity: number

  @column()
  declare unit: string

  @column({ serializeAs: 'unit_price' })
  declare unitPrice: number

  @column()
  declare supplier: string | null

  @column({ serializeAs: 'sort_order' })
  declare sortOrder: number

  @column.dateTime({ autoCreate: true, serializeAs: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updated_at' })
  declare updatedAt: DateTime

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>

  @computed({ serializeAs: 'subtotal' })
  get subtotal() {
    return Number(this.quantity) * Number(this.unitPrice)
  }
}
