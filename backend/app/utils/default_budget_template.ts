const v = (key: string, label: string) => ({
  type: 'templateVariable',
  attrs: { key, label },
})

const text = (value: string) => ({ type: 'text', text: value })

const paragraph = (...nodes: Record<string, unknown>[]) => ({
  type: 'paragraph',
  content: nodes,
})

const heading = (level: number, value: string) => ({
  type: 'heading',
  attrs: { level },
  content: [text(value)],
})

const section = (...content: Record<string, unknown>[]) => ({
  type: 'sectionBlock',
  content,
})

export const DEFAULT_BUDGET_DOCUMENT_CONTENT = {
  type: 'doc',
  content: [
    section(
      heading(1, 'Orçamento de Obra'),
      paragraph(text('Documento gerado em '), v('budget.generated_at', 'Data de Emissão'))
    ),
    section(
      heading(2, '1. Identificação da Obra'),
      paragraph(text('Nome da obra: '), v('budget.work_name', 'Nome da Obra')),
      paragraph(text('Tipo da obra: '), v('budget.work_type', 'Tipo da Obra')),
      paragraph(text('Localização: '), v('budget.location', 'Localização')),
      paragraph(text('Cidade/Estado: '), v('budget.city_state', 'Cidade/Estado'))
    ),
    section(
      heading(2, '2. Características Técnicas'),
      paragraph(text('Área construída: '), v('budget.built_area', 'Área Construída (m²)')),
      paragraph(text('Número de pavimentos: '), v('budget.floors', 'Número de Pavimentos')),
      paragraph(text('Padrão construtivo: '), v('budget.construction_standard', 'Padrão Construtivo')),
      paragraph(text('Complexidade da obra: '), v('budget.complexity', 'Complexidade da Obra'))
    ),
    section(
      heading(2, '3. Parâmetros do Orçamento'),
      paragraph(text('Prazo da obra: '), v('budget.deadline', 'Prazo da Obra')),
      paragraph(text('Data-base do orçamento: '), v('budget.base_date', 'Data-base do Orçamento')),
      paragraph(text('Índice de reajuste: '), v('budget.adjustment_index', 'Índice de Reajuste'))
    ),
    section(
      heading(2, '4. Materiais do Orçamento'),
      paragraph(
        text('Relação de materiais previstos como base para composição do orçamento:')
      ),
      paragraph(v('budget.materials_table', 'Tabela de Materiais')),
      paragraph(text('Total de materiais: '), v('budget.materials_total', 'Total de Materiais'))
    ),
    section(
      heading(2, '5. Composição do Orçamento'),
      paragraph(
        text(
          'Utilize esta seção para detalhar composições, quantitativos, custos unitários, BDI, encargos sociais e demais itens do orçamento conforme a metodologia da empresa.'
        )
      )
    ),
    section(
      heading(2, '6. Condições Gerais'),
      paragraph(
        text(
          'Inclua aqui validade da proposta, condições de pagamento, garantias, exclusões, premissas adotadas e observações técnicas relevantes para a execução da obra.'
        )
      )
    ),
  ],
}

export async function seedDefaultBudgetTemplate(companyId: string) {
  const { default: DocumentTemplate } = await import('#models/document_template')

  const existing = await DocumentTemplate.query()
    .where('companyId', companyId)
    .where('documentType', 'ORCAMENTO')
    .whereNull('deletedAt')
    .where('name', 'Orçamento Padrão')
    .first()

  if (existing) return existing

  return DocumentTemplate.create({
    companyId,
    clientId: null,
    name: 'Orçamento Padrão',
    documentType: 'ORCAMENTO',
    content: DEFAULT_BUDGET_DOCUMENT_CONTENT,
    createdBy: null,
  })
}
