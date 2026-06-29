import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { DocumentType } from '#constants/document_type'
import Company from './company.js'
import Client from './client.js'

export default class DocumentTemplate extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column({ serializeAs: 'company_id' })
  declare companyId: string

  @column({ serializeAs: 'client_id' })
  declare clientId: string | null

  @column()
  declare name: string

  @column({ serializeAs: 'document_type' })
  declare documentType: DocumentType

  @column()
  declare content: Record<string, unknown>

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
}
