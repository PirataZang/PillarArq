import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ActivityLog extends BaseModel {
  static table = 'activity_logs'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare event: 'created' | 'updated' | 'deleted'

  @column({ serializeAs: 'subject_type' })
  declare subjectType: string

  @column({ serializeAs: 'subject_id' })
  declare subjectId: string

  @column({ serializeAs: 'user_id' })
  declare userId: string | null

  @column({ serializeAs: 'company_id' })
  declare companyId: string | null

  @column({ serializeAs: 'ip_address' })
  declare ipAddress: string | null

  @column({ serializeAs: 'old_values' })
  declare oldValues: Record<string, unknown> | null

  @column({ serializeAs: 'new_values' })
  declare newValues: Record<string, unknown> | null

  @column.dateTime({ serializeAs: 'update_date' })
  declare updateDate: DateTime

  static forSubject(subjectType: string, subjectId: string) {
    return this.query()
      .where('subjectType', subjectType)
      .where('subjectId', subjectId)
      .orderBy('updateDate', 'desc')
  }

  static forCompany(companyId: string) {
    return this.query().where('companyId', companyId).orderBy('updateDate', 'desc')
  }
}
