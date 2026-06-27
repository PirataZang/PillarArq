import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'project_materials'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()
      table.bigInteger('company_id').notNullable().references('id').inTable('companies').onDelete('CASCADE')
      table.bigInteger('project_id').notNullable().references('id').inTable('projects').onDelete('CASCADE')

      table.string('name').notNullable()
      table.decimal('quantity', 12, 2).notNullable().defaultTo(1)
      table.string('unit').notNullable().defaultTo('un')
      table.decimal('unit_price', 12, 2).notNullable().defaultTo(0)
      table.string('supplier').nullable()
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
