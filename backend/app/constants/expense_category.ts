export const EXPENSE_CATEGORIES = [
  'LABOR',
  'TRANSPORT',
  'FEES',
  'OTHER',
] as const

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]
