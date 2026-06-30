const COMMON = {
  name: 'Nome',
  email: 'E-mail',
  phone: 'Telefone',
  document: 'Documento',
  address: 'Endereço',
  notes: 'Observações',
  description: 'Descrição',
  status: 'Status',
  isActive: 'Ativo',
  active: 'Ativo',
  companyId: 'Empresa',
  clientId: 'Cliente',
  projectId: 'Obra',
  createdBy: 'Criado por',
  updatedBy: 'Atualizado por',
  slug: 'Slug',
  maxUsers: 'Máx. usuários',
  maxProjects: 'Máx. obras',
  permissions: 'Permissões',
  serviceRatePerM2: 'Valor serviço (R$/m²)',
  service_rate_per_m2: 'Valor serviço (R$/m²)',
  areaM2: 'Área (m²)',
  area_m2: 'Área (m²)',
  serviceRateOverride: 'Taxa personalizada (R$/m²)',
  service_rate_override: 'Taxa personalizada (R$/m²)',
  extraAmount: 'Valor extra (R$)',
  extra_amount: 'Valor extra (R$)',
  progressPercent: 'Progresso (%)',
  progress_percent: 'Progresso (%)',
  startDate: 'Data de início',
  start_date: 'Data de início',
  expectedEndDate: 'Previsão de entrega',
  expected_end_date: 'Previsão de entrega',
  assignedUserId: 'Responsável',
  assigned_user_id: 'Responsável',
  documentType: 'Tipo do documento',
  document_type: 'Tipo do documento',
  content: 'Conteúdo',
  weightPercent: 'Peso (%)',
  weight_percent: 'Peso (%)',
  sortOrder: 'Ordem',
  sort_order: 'Ordem',
  isCompleted: 'Concluída',
  is_completed: 'Concluída',
  quantity: 'Quantidade',
  unit: 'Unidade',
  unitPrice: 'Preço unitário',
  unit_price: 'Preço unitário',
  supplier: 'Fornecedor',
  expenseDate: 'Data da despesa',
  expense_date: 'Data da despesa',
  category: 'Categoria',
  amount: 'Valor',
}

export function fieldLabel(key) {
  return COMMON[key] ?? key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())
}

export function formatAuditValue(value) {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não'
  if (typeof value === 'object') return JSON.stringify(value, null, 2)
  return String(value)
}

export function formatAuditDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export const EVENT_LABELS = {
  created: 'criou este registro',
  updated: 'atualizou este registro',
  deleted: 'excluiu este registro',
}

export const EVENT_FILTERS = [
  { value: 'all', label: 'Todos' },
  { value: 'created', label: 'Criações' },
  { value: 'updated', label: 'Edições' },
  { value: 'deleted', label: 'Exclusões' },
]
