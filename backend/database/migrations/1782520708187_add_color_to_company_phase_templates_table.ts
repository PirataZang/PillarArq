import { BaseSchema } from '@adonisjs/lucid/schema'

const COLORS = ['#5c5852', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#e11d48']

export default class extends BaseSchema {
  protected tableName = 'company_phase_templates'

  async up() {
    await this.db.rawQuery(`
      ALTER TABLE company_phase_templates
      ADD COLUMN IF NOT EXISTS color varchar(7) NOT NULL DEFAULT '#5c5852'
    `)

    const templates = await this.db.from(this.tableName).select('id', 'sort_order')

    for (const template of templates) {
      await this.db
        .from(this.tableName)
        .where('id', template.id)
        .update({ color: COLORS[(Number(template.sort_order) - 1) % COLORS.length] })
    }
  }

  async down() {
    await this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('color')
    })
  }
}
