import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'company_phase_templates'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()
      table.bigInteger('company_id').notNullable().references('id').inTable('companies').onDelete('CASCADE')

      table.string('name').notNullable()
      table.text('description').nullable()
      table.integer('weight_percent').notNullable().defaultTo(0)
      table.integer('sort_order').notNullable().defaultTo(0)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.index(['company_id', 'sort_order'])
    })

    this.schema.alterTable('project_phases', (table) => {
      table.text('description').nullable()
    })
  }

  async down() {
    this.schema.alterTable('project_phases', (table) => {
      table.dropColumn('description')
    })

    this.schema.dropTable(this.tableName)
  }
}
