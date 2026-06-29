import vine from '@vinejs/vine'
import { PROJECT_STATUSES } from '#constants/project_status'

const sqlDate = () => vine.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/)

export const dashboardStatsValidator = vine.compile(
  vine.object({
    period_from: sqlDate().optional(),
    period_to: sqlDate().optional(),
    status: vine.enum(PROJECT_STATUSES).optional(),
  })
)
