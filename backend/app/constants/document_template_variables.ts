import type { DocumentType } from '#constants/document_type'

export interface TemplateVariableItem {
  key: string
  label: string
}

export interface TemplateVariableGroup {
  id: string
  label: string
  items: TemplateVariableItem[]
}

export const GENERAL_TEMPLATE_VARIABLES: TemplateVariableGroup[] = [
  {
    id: 'company',
    label: 'Empresa',
    items: [
      { key: 'company.name', label: 'Nome da Empresa' },
      { key: 'company.document', label: 'CNPJ' },
      { key: 'company.address', label: 'Endereço' },
    ],
  },
  {
    id: 'user',
    label: 'Usuário',
    items: [
      { key: 'user.name', label: 'Nome do Usuário' },
      { key: 'user.email', label: 'E-mail do Usuário' },
      { key: 'user.phone', label: 'Telefone' },
    ],
  },
  {
    id: 'client',
    label: 'Cliente',
    items: [
      { key: 'client.name', label: 'Nome do Cliente' },
      { key: 'client.email', label: 'E-mail do Cliente' },
      { key: 'client.phone', label: 'Telefone do Cliente' },
      { key: 'client.document', label: 'Documento' },
      { key: 'client.address', label: 'Endereço' },
    ],
  },
  {
    id: 'project',
    label: 'Obra',
    items: [
      { key: 'project.name', label: 'Nome da Obra' },
      { key: 'project.address', label: 'Endereço da Obra' },
      { key: 'project.status', label: 'Status' },
      { key: 'project.total_budget', label: 'Orçamento Total' },
      { key: 'project.start_date', label: 'Data de Início' },
    ],
  },
  {
    id: 'proposal',
    label: 'Proposta',
    items: [
      { key: 'proposal.total', label: 'Valor Total' },
      { key: 'proposal.date', label: 'Data de Emissão' },
    ],
  },
]

export const BUDGET_TEMPLATE_VARIABLES: TemplateVariableGroup[] = [
  {
    id: 'budget_identification',
    label: 'Identificação da Obra',
    items: [
      { key: 'budget.work_name', label: 'Nome da Obra' },
      { key: 'budget.work_type', label: 'Tipo da Obra' },
      { key: 'budget.location', label: 'Localização' },
      { key: 'budget.city_state', label: 'Cidade/Estado' },
    ],
  },
  {
    id: 'budget_technical',
    label: 'Características Técnicas',
    items: [
      { key: 'budget.built_area', label: 'Área Construída (m²)' },
      { key: 'budget.floors', label: 'Número de Pavimentos' },
      { key: 'budget.construction_standard', label: 'Padrão Construtivo' },
      { key: 'budget.complexity', label: 'Complexidade da Obra' },
    ],
  },
  {
    id: 'budget_parameters',
    label: 'Parâmetros do Orçamento',
    items: [
      { key: 'budget.deadline', label: 'Prazo da Obra' },
      { key: 'budget.deadline_months', label: 'Prazo (meses)' },
      { key: 'budget.base_date', label: 'Data-base do Orçamento' },
      { key: 'budget.adjustment_index', label: 'Índice de Reajuste' },
      { key: 'budget.generated_at', label: 'Data de Emissão' },
    ],
  },
  {
    id: 'budget_materials',
    label: 'Materiais',
    items: [
      { key: 'budget.materials_table', label: 'Tabela de Materiais' },
      { key: 'budget.materials_total', label: 'Total de Materiais' },
      { key: 'budget.materials_count', label: 'Quantidade de Itens' },
    ],
  },
]

export function getTemplateVariablesByType(documentType: DocumentType = 'GERAL'): TemplateVariableGroup[] {
  return documentType === 'ORCAMENTO' ? BUDGET_TEMPLATE_VARIABLES : GENERAL_TEMPLATE_VARIABLES
}
