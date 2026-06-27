import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'companies'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('max_users').notNullable().defaultTo(5)
      table.integer('max_projects').notNullable().defaultTo(5)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('max_users')
      table.dropColumn('max_projects')
    })
  }
}
