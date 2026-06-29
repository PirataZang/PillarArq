import { BaseSchema } from '@adonisjs/lucid/schema'

const DEFAULT_PHASES = [
  { name: 'Briefing & Levantamento', description: 'Reunião inicial e levantamento do terreno.', weight_percent: 10, sort_order: 1 },
  { name: 'Anteprojeto', description: 'Estudo preliminar e definição de conceito.', weight_percent: 15, sort_order: 2 },
  { name: 'Projeto Legal', description: 'Documentação para aprovação em órgãos públicos.', weight_percent: 20, sort_order: 3 },
  { name: 'Projeto Executivo', description: 'Detalhamento técnico para execução da obra.', weight_percent: 25, sort_order: 4 },
  { name: 'Acompanhamento de Obra', description: 'Visitas e conferência da execução.', weight_percent: 20, sort_order: 5 },
  { name: 'Entrega Final', description: 'Entrega da documentação e encerramento.', weight_percent: 10, sort_order: 6 },
]

export default class extends BaseSchema {
  async up() {
    const companies = await this.db.from('companies').whereNull('deleted_at').select('id')
    const now = new Date()

    for (const company of companies) {
      const existing = await this.db
        .from('company_phase_templates')
        .where('company_id', company.id)
        .first()

      if (existing) {
        continue
      }

      await this.db.table('company_phase_templates').multiInsert(
        DEFAULT_PHASES.map((phase) => ({
          company_id: company.id,
          name: phase.name,
          description: phase.description,
          weight_percent: phase.weight_percent,
          sort_order: phase.sort_order,
          created_at: now,
          updated_at: now,
        }))
      )
    }
  }

  async down() {
    await this.db.from('company_phase_templates').delete()
  }
}
