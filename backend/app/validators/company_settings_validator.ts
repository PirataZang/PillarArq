import vine from '@vinejs/vine'

const hexColor = () => vine.string().trim().regex(/^#[0-9A-Fa-f]{6}$/)

export const createCompanyPhaseTemplateValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1),
    description: vine.string().trim().optional(),
    weight_percent: vine.number().min(0).max(100),
    color: hexColor().optional(),
    sort_order: vine.number().min(0).optional(),
  })
)

export const updateCompanyPhaseTemplateValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).optional(),
    description: vine.string().trim().nullable().optional(),
    weight_percent: vine.number().min(0).max(100).optional(),
    color: hexColor().optional(),
    sort_order: vine.number().min(0).optional(),
  })
)
