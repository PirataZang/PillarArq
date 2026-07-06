import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'activity_logs'

  async up() {
    const exists = await this.schema.hasTable(this.tableName)
    if (!exists) return

    await this.db.rawQuery(`
      ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS user_id bigint REFERENCES users(id) ON DELETE SET NULL
    `)

    await this.db.rawQuery(`
      ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS ip_address varchar(255)
    `)

    await this.db.rawQuery(`
      ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS old_values jsonb
    `)

    await this.db.rawQuery(`
      ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS new_values jsonb
    `)

    await this.db.rawQuery(`
      ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS update_date timestamptz
    `)

    const hasCauserId = await this.schema.hasColumn(this.tableName, 'causer_id')
    if (hasCauserId) {
      await this.db.rawQuery(`
        UPDATE activity_logs SET user_id = causer_id
        WHERE user_id IS NULL AND causer_id IS NOT NULL
      `)
    }

    const hasCreatedAt = await this.schema.hasColumn(this.tableName, 'created_at')
    if (hasCreatedAt) {
      await this.db.rawQuery(`
        UPDATE activity_logs SET update_date = created_at
        WHERE update_date IS NULL AND created_at IS NOT NULL
      `)
    }

    await this.db.rawQuery(`
      UPDATE activity_logs SET update_date = NOW() WHERE update_date IS NULL
    `)

    await this.db.rawQuery(`
      ALTER TABLE activity_logs ALTER COLUMN update_date SET NOT NULL
    `).catch(() => undefined)

    for (const column of ['log_name', 'causer_type', 'causer_id', 'properties', 'created_at']) {
      await this.db.rawQuery(`ALTER TABLE activity_logs DROP COLUMN IF EXISTS ${column}`)
    }
  }

  async down() {}
}
