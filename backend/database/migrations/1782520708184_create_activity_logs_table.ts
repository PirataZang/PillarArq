import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'activity_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()
      table.string('event').notNullable()
      table.string('subject_type').notNullable()
      table.bigInteger('subject_id').notNullable()
      table.bigInteger('user_id').nullable().references('id').inTable('users').onDelete('SET NULL')
      table
        .bigInteger('company_id')
        .nullable()
        .references('id')
        .inTable('companies')
        .onDelete('CASCADE')
      table.string('ip_address').nullable()
      table.jsonb('old_values').nullable()
      table.jsonb('new_values').nullable()
      table.timestamp('update_date', { useTz: true }).notNullable()

      table.index(['company_id', 'update_date'])
      table.index(['subject_type', 'subject_id'])
      table.index(['user_id'])
      table.index(['event'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
