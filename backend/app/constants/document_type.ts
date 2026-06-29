export const DOCUMENT_TYPES = ['GERAL', 'ORCAMENTO'] as const

export type DocumentType = (typeof DOCUMENT_TYPES)[number]

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  GERAL: 'Geral',
  ORCAMENTO: 'Orçamento',
}
