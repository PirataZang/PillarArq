import type Project from '#models/project'

export interface ProjectBudgetSummary {
  area_m2: number
  service_rate: number
  service_amount: number
  materials_total: number
  extras_total: number
  budget_total: number
  expenses_total: number
  balance: number
}

function toNumber(value: number | string | null | undefined): number {
  if (value === null || value === undefined) {
    return 0
  }

  return Number(value)
}

export function resolveServiceRate(project: Project): number {
  if (project.serviceRateOverride !== null && project.serviceRateOverride !== undefined) {
    return toNumber(project.serviceRateOverride)
  }

  return toNumber(project.client?.serviceRatePerM2)
}

export function calculateMaterialsTotal(project: Project): number {
  if (!project.materials?.length) {
    return 0
  }

  return project.materials.reduce((total, material) => {
    return total + toNumber(material.quantity) * toNumber(material.unitPrice)
  }, 0)
}

export function calculateExpensesTotal(project: Project): number {
  if (!project.expenses?.length) {
    return 0
  }

  return project.expenses.reduce((total, expense) => {
    return total + toNumber(expense.amount)
  }, 0)
}

function calculateProgressFromActivePhase(
  phases: Array<{
    isActive: boolean
    weight: number
    sortOrder: number
  }>
) {
  if (!phases.length) {
    return 0
  }

  const activePhase = phases
    .filter((phase) => phase.isActive)
    .sort((a, b) => b.sortOrder - a.sortOrder)[0]

  if (!activePhase) {
    return 0
  }

  return Math.min(100, Math.round(activePhase.weight))
}

export function calculateProgressPercent(project: Project): number {
  if (!project.phases?.length) {
    return project.progressPercent ?? 0
  }

  return calculateProgressFromActivePhase(
    project.phases.map((phase) => ({
      isActive: phase.isCompleted,
      weight: toNumber(phase.weightPercent),
      sortOrder: toNumber(phase.sortOrder),
    }))
  )
}

export function calculateProgressPercentFromPhases(
  phases: Array<{
    is_completed?: boolean
    weight_percent?: number
    sort_order?: number
  }>
) {
  return calculateProgressFromActivePhase(
    phases.map((phase) => ({
      isActive: Boolean(phase.is_completed),
      weight: toNumber(phase.weight_percent),
      sortOrder: toNumber(phase.sort_order),
    }))
  )
}

export function buildProjectBudgetSummary(project: Project): ProjectBudgetSummary {
  const areaM2 = toNumber(project.areaM2)
  const serviceRate = resolveServiceRate(project)
  const serviceAmount = areaM2 * serviceRate
  const materialsTotal = calculateMaterialsTotal(project)
  const extrasTotal = toNumber(project.extraAmount)
  const budgetTotal = serviceAmount + extrasTotal
  const expensesTotal = calculateExpensesTotal(project) + materialsTotal

  return {
    area_m2: areaM2,
    service_rate: serviceRate,
    service_amount: serviceAmount,
    materials_total: materialsTotal,
    extras_total: extrasTotal,
    budget_total: budgetTotal,
    expenses_total: expensesTotal,
    balance: budgetTotal - expensesTotal,
  }
}
