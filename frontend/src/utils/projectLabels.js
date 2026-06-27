export const PROJECT_STATUS_LABELS = {
  DRAFT: 'Rascunho',
  BUDGETING: 'Orçamento',
  IN_PROGRESS: 'Em andamento',
  ON_HOLD: 'Pausada',
  COMPLETED: 'Concluída',
  ARCHIVED: 'Arquivada',
}

export const PROJECT_STATUS_OPTIONS = Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}))

export const EXPENSE_CATEGORY_LABELS = {
  MATERIAL: 'Material',
  LABOR: 'Mão de obra',
  TRANSPORT: 'Transporte',
  FEES: 'Taxas',
  OTHER: 'Outros',
}

export const EXPENSE_CATEGORY_OPTIONS = Object.entries(EXPENSE_CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}))
