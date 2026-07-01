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

const DEFAULT_PHASE_COLORS = ['#5c5852', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#e11d48']

export interface PhaseTemplateSnapshot {
  color: string
  weight_percent: number
  name: string
  description: string | null
}

export async function resolvePhaseTemplatesBySortOrder(companyId: string) {
  const templates = await listCompanyPhaseTemplates(companyId)

  return new Map<number, PhaseTemplateSnapshot>(
    templates.map((template) => [
      template.sortOrder,
      {
        color: template.color,
        weight_percent: template.weightPercent,
        name: template.name,
        description: template.description,
      },
    ])
  )
}

export function applyPhaseTemplates(
  phases: Array<Record<string, unknown>>,
  templatesBySortOrder: Map<number, PhaseTemplateSnapshot>
) {
  return phases.map((phase, index) => {
    const template = templatesBySortOrder.get(Number(phase.sort_order))

    if (!template) {
      return {
        ...phase,
        color: phase.color ?? DEFAULT_PHASE_COLORS[index % DEFAULT_PHASE_COLORS.length],
      }
    }

    return {
      ...phase,
      name: template.name,
      description: template.description,
      weight_percent: template.weight_percent,
      color: template.color,
    }
  })
}

export async function seedDefaultPhaseTemplates(companyId: string) {
  const existing = await CompanyPhaseTemplate.query().where('companyId', companyId).first()
  if (existing) {
    return
  }

  await CompanyPhaseTemplate.createMany(
    DEFAULT_PROJECT_PHASES.map((phase, index) => ({
      companyId,
      name: phase.name,
      description: DEFAULT_PHASE_DESCRIPTIONS[phase.name] ?? null,
      weightPercent: phase.weightPercent,
      color: DEFAULT_PHASE_COLORS[index % DEFAULT_PHASE_COLORS.length],
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
