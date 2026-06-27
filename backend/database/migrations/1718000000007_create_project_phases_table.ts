import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'project_phases'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()
      table.bigInteger('company_id').notNullable().references('id').inTable('companies').onDelete('CASCADE')
      table.bigInteger('project_id').notNullable().references('id').inTable('projects').onDelete('CASCADE')

      table.string('name').notNullable()
      table.integer('weight_percent').notNullable().defaultTo(0)
      table.boolean('is_completed').notNullable().defaultTo(false)
      table.timestamp('completed_at', { useTz: true }).nullable()
      table.integer('sort_order').notNullable().defaultTo(0)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.index(['company_id', 'project_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
