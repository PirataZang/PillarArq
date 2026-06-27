export const PROJECT_STATUSES = [
  'DRAFT',
  'BUDGETING',
  'IN_PROGRESS',
  'ON_HOLD',
  'COMPLETED',
  'ARCHIVED',
] as const

export type ProjectStatus = (typeof PROJECT_STATUSES)[number]

export const DEFAULT_PROJECT_STATUS: ProjectStatus = 'DRAFT'
