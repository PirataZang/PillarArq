export const WORK_TYPE_OPTIONS = [
  { value: 'RESIDENCIAL', label: 'Residencial' },
  { value: 'COMERCIAL', label: 'Comercial' },
  { value: 'INDUSTRIAL', label: 'Industrial' },
  { value: 'INSTITUCIONAL', label: 'Institucional' },
  { value: 'REFORMA', label: 'Reforma' },
  { value: 'MISTO', label: 'Misto' },
]

export const CONSTRUCTION_STANDARD_OPTIONS = [
  { value: 'BAIXO', label: 'Baixo' },
  { value: 'MEDIO', label: 'Médio' },
  { value: 'ALTO', label: 'Alto' },
  { value: 'LUXO', label: 'Luxo' },
]

export const COMPLEXITY_OPTIONS = [
  { value: 'BAIXA', label: 'Baixa' },
  { value: 'MEDIA', label: 'Média' },
  { value: 'ALTA', label: 'Alta' },
  { value: 'MUITO_ALTA', label: 'Muito alta' },
]

export const ADJUSTMENT_INDEX_OPTIONS = [
  { value: 'INCC', label: 'INCC' },
  { value: 'IPCA', label: 'IPCA' },
  { value: 'IGP-M', label: 'IGP-M' },
  { value: 'CUB', label: 'CUB' },
  { value: 'OUTRO', label: 'Outro' },
]

export const WORK_TYPE_LABELS = Object.fromEntries(
  WORK_TYPE_OPTIONS.map((item) => [item.value, item.label])
)

export const CONSTRUCTION_STANDARD_LABELS = Object.fromEntries(
  CONSTRUCTION_STANDARD_OPTIONS.map((item) => [item.value, item.label])
)

export const COMPLEXITY_LABELS = Object.fromEntries(
  COMPLEXITY_OPTIONS.map((item) => [item.value, item.label])
)

export const ADJUSTMENT_INDEX_LABELS = Object.fromEntries(
  ADJUSTMENT_INDEX_OPTIONS.map((item) => [item.value, item.label])
)

export function labelForValue(options, value) {
  return options.find((item) => item.value === value)?.label ?? value ?? ''
}
