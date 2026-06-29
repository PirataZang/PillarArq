import CompanyPhaseTemplate from '#models/company_phase_template'
import { DEFAULT_PROJECT_PHASES } from '#constants/default_project_phases'

const DEFAULT_PHASE_DESCRIPTIONS: Record<string, string> = {
  'Briefing & Site Survey': 'Reunião inicial e levantamento do terreno.',
  'Preliminary Design': 'Estudo preliminar e definição de conceito.',
  'Legal Project': 'Documentação para aprovação em órgãos públicos.',
  'Detailed Design': 'Detalhamento técnico para execução da obra.',
  'Construction Follow-up': 'Visitas e conferência da execução.',
  'Final Delivery': 'Entrega da documentação e encerramento.',
}

export async function seedDefaultPhaseTemplates(companyId: string) {
  const existing = await CompanyPhaseTemplate.query().where('companyId', companyId).first()
  if (existing) {
    return
  }

  await CompanyPhaseTemplate.createMany(
    DEFAULT_PROJECT_PHASES.map((phase) => ({
      companyId,
      name: phase.name,
      description: DEFAULT_PHASE_DESCRIPTIONS[phase.name] ?? null,
      weightPercent: phase.weightPercent,
      sortOrder: phase.sortOrder,
    }))
  )
}

export async function listCompanyPhaseTemplates(companyId: string) {
  return CompanyPhaseTemplate.query().where('companyId', companyId).orderBy('sortOrder', 'asc')
}

export interface ProjectPhaseSeed {
  name: string
  description: string | null
  weightPercent: number
  sortOrder: number
}

export async function resolveProjectPhaseSeeds(companyId: string): Promise<ProjectPhaseSeed[]> {
  const templates = await listCompanyPhaseTemplates(companyId)

  if (templates.length) {
    return templates.map((template) => ({
      name: template.name,
      description: template.description,
      weightPercent: template.weightPercent,
      sortOrder: template.sortOrder,
    }))
  }

  return DEFAULT_PROJECT_PHASES.map((phase) => ({
    name: phase.name,
    description: DEFAULT_PHASE_DESCRIPTIONS[phase.name] ?? null,
    weightPercent: phase.weightPercent,
    sortOrder: phase.sortOrder,
  }))
}
