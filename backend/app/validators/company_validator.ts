import vine from '@vinejs/vine'

export const createCompanyValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    slug: vine.string().trim().minLength(3),
    is_active: vine.boolean().optional()
  })
)
