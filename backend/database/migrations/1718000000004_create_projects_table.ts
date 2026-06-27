import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'projects'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()
      table.bigInteger('company_id').notNullable().references('id').inTable('companies').onDelete('CASCADE')
      table.bigInteger('client_id').notNullable().references('id').inTable('clients').onDelete('RESTRICT')
      table.bigInteger('assigned_user_id').nullable().references('id').inTable('users').onDelete('SET NULL')

      table.string('name').notNullable()
      table.text('description').nullable()
      table.text('address').nullable()
      table.decimal('area_m2', 12, 2).notNullable().defaultTo(0)
      table.string('status').notNullable().defaultTo('DRAFT')
      table.decimal('service_rate_override', 12, 2).nullable()
      table.decimal('extra_amount', 12, 2).notNullable().defaultTo(0)
      table.integer('progress_percent').notNullable().defaultTo(0)

      table.date('start_date').nullable()
      table.date('expected_end_date').nullable()

      table.bigInteger('created_by').nullable().references('id').inTable('users').onDelete('SET NULL')
      table.bigInteger('updated_by').nullable().references('id').inTable('users').onDelete('SET NULL')

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      table.timestamp('deleted_at', { useTz: true }).nullable()

      table.index(['company_id'])
      table.index(['company_id', 'id'])
      table.index(['company_id', 'client_id'])
      table.index(['company_id', 'status'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
