export interface BudgetMaterialInput {
  name: string
  quantity: number | string
  unit: string
  unit_price: number | string
  supplier?: string | null
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function toNumber(value: number | string | null | undefined): number {
  if (value === null || value === undefined || value === '') return 0
  const numeric = typeof value === 'number' ? value : Number(String(value).replace(',', '.'))
  return Number.isNaN(numeric) ? 0 : numeric
}

export function calculateMaterialsTotal(materials: BudgetMaterialInput[] = []): number {
  return materials.reduce((total, item) => {
    return total + toNumber(item.quantity) * toNumber(item.unit_price)
  }, 0)
}

export function buildMaterialsTableHtml(materials: BudgetMaterialInput[] = []): string {
  if (!materials.length) {
    return '<p class="budget-table-empty">Nenhum material informado para este orçamento.</p>'
  }

  const rows = materials
    .map((item) => {
      const quantity = toNumber(item.quantity)
      const unitPrice = toNumber(item.unit_price)
      const subtotal = quantity * unitPrice

      return `<tr>
        <td>${escapeHtml(item.name)}</td>
        <td class="num">${escapeHtml(String(quantity))}</td>
        <td>${escapeHtml(item.unit || 'un')}</td>
        <td class="num">${escapeHtml(formatCurrency(unitPrice))}</td>
        <td class="num">${escapeHtml(formatCurrency(subtotal))}</td>
        <td>${escapeHtml(item.supplier?.trim() || '—')}</td>
      </tr>`
    })
    .join('')

  const total = calculateMaterialsTotal(materials)

  return `<div class="budget-materials-table-wrap">
    <table class="budget-materials-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Qtd</th>
          <th>Un.</th>
          <th>Preço un.</th>
          <th>Subtotal</th>
          <th>Fornecedor</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr>
          <td colspan="4"><strong>Total de materiais</strong></td>
          <td class="num" colspan="2"><strong>${escapeHtml(formatCurrency(total))}</strong></td>
        </tr>
      </tfoot>
    </table>
  </div>`
}

export const BUDGET_HTML_VARIABLE_KEYS = new Set(['budget.materials_table'])
