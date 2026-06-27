import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'clients'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()
      table.bigInteger('company_id').notNullable().references('id').inTable('companies').onDelete('CASCADE')

      table.string('name').notNullable()
      table.string('email').nullable()
      table.string('phone').nullable()
      table.string('document').nullable()
      table.text('address').nullable()
      table.decimal('service_rate_per_m2', 12, 2).notNullable().defaultTo(0)
      table.text('notes').nullable()
      table.boolean('is_active').defaultTo(true).notNullable()

      table.bigInteger('created_by').nullable().references('id').inTable('users').onDelete('SET NULL')
      table.bigInteger('updated_by').nullable().references('id').inTable('users').onDelete('SET NULL')

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      table.timestamp('deleted_at', { useTz: true }).nullable()

      table.index(['company_id'])
      table.index(['company_id', 'id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
