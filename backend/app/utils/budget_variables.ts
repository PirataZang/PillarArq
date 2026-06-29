import { DateTime } from 'luxon'

const WORK_TYPE_LABELS: Record<string, string> = {
  RESIDENCIAL: 'Residencial',
  COMERCIAL: 'Comercial',
  INDUSTRIAL: 'Industrial',
  INSTITUCIONAL: 'Institucional',
  REFORMA: 'Reforma',
  MISTO: 'Misto',
}

const CONSTRUCTION_STANDARD_LABELS: Record<string, string> = {
  BAIXO: 'Baixo',
  MEDIO: 'Médio',
  ALTO: 'Alto',
  LUXO: 'Luxo',
}

const COMPLEXITY_LABELS: Record<string, string> = {
  BAIXA: 'Baixa',
  MEDIA: 'Média',
  ALTA: 'Alta',
  MUITO_ALTA: 'Muito alta',
}

const ADJUSTMENT_INDEX_LABELS: Record<string, string> = {
  INCC: 'INCC',
  IPCA: 'IPCA',
  'IGP-M': 'IGP-M',
  CUB: 'CUB',
  OUTRO: 'Outro',
}

function labelFor(map: Record<string, string>, value: string | null | undefined): string {
  if (!value) return ''
  return map[value] ?? value
}

export interface BudgetVariableInput {
  work_name?: string | null
  work_type?: string | null
  built_area?: number | string | null
  floors?: number | string | null
  construction_standard?: string | null
  location?: string | null
  city_state?: string | null
  deadline?: string | null
  deadline_months?: number | string | null
  base_date?: string | null
  adjustment_index?: string | null
  adjustment_index_other?: string | null
  complexity?: string | null
}

function formatArea(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return ''
  const numeric = typeof value === 'number' ? value : Number(String(value).replace(',', '.'))
  if (Number.isNaN(numeric)) return String(value)
  return `${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(numeric)} m²`
}

function formatDate(value: string | null | undefined): string {
  if (!value) return ''
  const parsed = DateTime.fromISO(value)
  if (parsed.isValid) return parsed.toFormat('dd/MM/yyyy')
  const br = DateTime.fromFormat(value, 'dd/MM/yyyy')
  return br.isValid ? br.toFormat('dd/MM/yyyy') : value
}

function formatDeadline(deadline: string | null | undefined, months: number | string | null | undefined): string {
  if (deadline?.trim()) return deadline.trim()
  if (months === null || months === undefined || months === '') return ''
  return `${months} meses`
}

export function buildBudgetVariables(data: BudgetVariableInput = {}): Record<string, string> {
  const adjustmentIndex =
    data.adjustment_index === 'OUTRO'
      ? (data.adjustment_index_other?.trim() ?? 'Outro')
      : labelFor(ADJUSTMENT_INDEX_LABELS, data.adjustment_index)

  return {
    'budget.work_name': data.work_name?.trim() ?? '',
    'budget.work_type': labelFor(WORK_TYPE_LABELS, data.work_type),
    'budget.built_area': formatArea(data.built_area),
    'budget.floors': data.floors !== null && data.floors !== undefined ? String(data.floors) : '',
    'budget.construction_standard': labelFor(CONSTRUCTION_STANDARD_LABELS, data.construction_standard),
    'budget.location': data.location?.trim() ?? '',
    'budget.city_state': data.city_state?.trim() ?? '',
    'budget.deadline': formatDeadline(data.deadline, data.deadline_months),
    'budget.deadline_months':
      data.deadline_months !== null && data.deadline_months !== undefined
        ? String(data.deadline_months)
        : '',
    'budget.base_date': formatDate(data.base_date),
    'budget.adjustment_index': adjustmentIndex,
    'budget.complexity': labelFor(COMPLEXITY_LABELS, data.complexity),
    'budget.generated_at': DateTime.now().toFormat('dd/MM/yyyy'),
  }
}
