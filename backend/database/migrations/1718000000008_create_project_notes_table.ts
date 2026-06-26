import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'project_notes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()
      table.bigInteger('company_id').notNullable().references('id').inTable('companies').onDelete('CASCADE')
      table.bigInteger('project_id').notNullable().references('id').inTable('projects').onDelete('CASCADE')

      table.text('content').notNullable()
      table.bigInteger('created_by').nullable().references('id').inTable('users').onDelete('SET NULL')

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.index(['company_id', 'project_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
