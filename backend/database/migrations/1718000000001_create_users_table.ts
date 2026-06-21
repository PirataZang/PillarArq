import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()
      table.bigInteger('company_id').notNullable().references('id').inTable('companies').onDelete('CASCADE')
      
      table.string('name').notNullable()
      table.string('email').notNullable().unique()
      table.string('password').notNullable()
      table.string('role').notNullable().defaultTo('USER')
      table.boolean('is_active').defaultTo(true).notNullable()
      table.boolean('is_master').defaultTo(false).notNullable()
      table.text('token').nullable()
      table.timestamp('last_login_at', { useTz: true }).nullable()

      table.bigInteger('created_by').nullable().references('id').inTable('users').onDelete('SET NULL')
      table.bigInteger('updated_by').nullable().references('id').inTable('users').onDelete('SET NULL')

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      table.timestamp('deleted_at', { useTz: true }).nullable()

      // Indices requested
      table.index(['company_id'])
      table.index(['company_id', 'id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
