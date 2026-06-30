import vine from '@vinejs/vine'

export const listActivityLogsValidator = vine.compile(
  vine.object({
    subject_type: vine.string().trim().optional(),
    subject_id: vine.string().trim().optional(),
    event: vine.enum(['created', 'updated', 'deleted'] as const).optional(),
    user_id: vine.string().trim().optional(),
    page: vine.number().min(1).optional(),
    per_page: vine.number().min(1).max(100).optional(),
  })
)
