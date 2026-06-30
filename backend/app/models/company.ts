import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import { Auditable } from './mixins/auditable.js'

export default class Company extends Auditable(BaseModel) {
  @column({ isPrimary: true })
  declare id: string // Note: bigIncrements usually maps to string in TS to avoid precision loss

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare isActive: boolean

  @column({ serializeAs: 'maxUsers' })
  declare maxUsers: number

  @column({ serializeAs: 'maxProjects' })
  declare maxProjects: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null

  @hasMany(() => User)
  declare users: HasMany<typeof User>
}
