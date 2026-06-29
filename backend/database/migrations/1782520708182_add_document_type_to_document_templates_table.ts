import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'document_templates'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('document_type', 20).notNullable().defaultTo('GERAL')
      table.index(['company_id', 'document_type'])
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex(['company_id', 'document_type'])
      table.dropColumn('document_type')
    })
  }
}
