import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'document_templates'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()
      table.bigInteger('company_id').notNullable().references('id').inTable('companies').onDelete('CASCADE')
      table.bigInteger('client_id').nullable().references('id').inTable('clients').onDelete('SET NULL')

      table.string('name').notNullable()
      table.jsonb('content').notNullable()

      table.bigInteger('created_by').nullable().references('id').inTable('users').onDelete('SET NULL')
      table.bigInteger('updated_by').nullable().references('id').inTable('users').onDelete('SET NULL')

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      table.timestamp('deleted_at', { useTz: true }).nullable()

      table.index(['company_id'])
      table.index(['company_id', 'client_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
