export const TEMPLATE_VARIABLES = [
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

export const flattenVariables = () =>
  TEMPLATE_VARIABLES.flatMap((group) =>
    group.items.map((item) => ({ ...item, group: group.label }))
  )
