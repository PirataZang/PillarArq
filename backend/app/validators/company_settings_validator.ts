import vine from '@vinejs/vine'

export const createCompanyPhaseTemplateValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1),
    description: vine.string().trim().optional(),
    weight_percent: vine.number().min(0).max(100),
    sort_order: vine.number().min(0).optional(),
  })
)

export const updateCompanyPhaseTemplateValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).optional(),
    description: vine.string().trim().nullable().optional(),
    weight_percent: vine.number().min(0).max(100).optional(),
    sort_order: vine.number().min(0).optional(),
  })
)
