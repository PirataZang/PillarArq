import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    await this.db
      .from('projects')
      .whereNot('status', 'ARCHIVED')
      .whereNotNull('deleted_at')
      .update({ deleted_at: null })
  }

  async down() {}
}
