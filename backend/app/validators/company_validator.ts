import vine from '@vinejs/vine'

export const createCompanyValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    slug: vine.string().trim().minLength(3),
    is_active: vine.boolean().optional()
  })
)

export const updateCompanyValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).optional(),
    slug: vine.string().trim().minLength(3).optional(),
    is_active: vine.boolean().optional()
  })
)
