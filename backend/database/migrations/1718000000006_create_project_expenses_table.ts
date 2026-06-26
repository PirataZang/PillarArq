import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'project_expenses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()
      table.bigInteger('company_id').notNullable().references('id').inTable('companies').onDelete('CASCADE')
      table.bigInteger('project_id').notNullable().references('id').inTable('projects').onDelete('CASCADE')

      table.date('expense_date').notNullable()
      table.string('category').notNullable().defaultTo('OTHER')
      table.string('description').notNullable()
      table.decimal('amount', 12, 2).notNullable().defaultTo(0)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.index(['company_id', 'project_id'])
      table.index(['company_id', 'expense_date'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
