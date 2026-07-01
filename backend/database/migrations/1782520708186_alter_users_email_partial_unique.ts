import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    await this.db.rawQuery(`ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_unique`)
    await this.db.rawQuery(`DROP INDEX IF EXISTS users_email_unique`)
    await this.db.rawQuery(`
      CREATE UNIQUE INDEX IF NOT EXISTS users_email_active_unique
      ON users (email)
      WHERE deleted_at IS NULL
    `)
  }

  async down() {
    await this.db.rawQuery(`DROP INDEX IF EXISTS users_email_active_unique`)
    await this.db.rawQuery(`
      ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email)
    `).catch(() => undefined)
  }
}
