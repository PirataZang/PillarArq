import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, column, belongsTo, beforeSave } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Company from './company.js'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column({ serializeAs: 'company_id' })
  declare companyId: string

  @column()
  declare name: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare role: string

  @column({ serializeAs: 'active' })
  declare isActive: boolean

  @column({ serializeAs: 'master' })
  declare isMaster: boolean

  @column({ serializeAs: null })
  declare token: string | null

  @column.dateTime({ serializeAs: 'last_login_at' })
  declare lastLoginAt: DateTime | null

  @column.dateTime({ autoCreate: true, serializeAs: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updated_at' })
  declare updatedAt: DateTime

  @column({ serializeAs: 'created_by' })
  declare createdBy: string | null

  @column({ serializeAs: 'updated_by' })
  declare updatedBy: string | null

  @column.dateTime({ serializeAs: 'deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => Company)
  declare company: BelongsTo<typeof Company>

  // Colunas para ocultar na serialização (como no Laravel)
  static get hidden() {
    return ['password', 'token']
  }

  serialize(cherryPick?: any) {
    const data = super.serialize(cherryPick)
    const hiddenFields = (this.constructor as typeof User).hidden
    if (hiddenFields) {
      for (const field of hiddenFields) {
        delete data[field]
        // Remove também variações camelCase ou snake_case se houver
        delete data[field.replace(/_([a-z])/g, (g) => g[1].toUpperCase())]
        delete data[field.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)]
      }
    }
    return data
  }

  @beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }
}
