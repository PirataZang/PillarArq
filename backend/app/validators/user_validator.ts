import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    email: vine.string().email().trim(),
    password: vine.string().minLength(6),
    role: vine.string().trim().optional()
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).optional(),
    email: vine.string().email().trim().optional(),
    password: vine.string().minLength(6).optional(),
    role: vine.string().trim().optional(),
    is_active: vine.boolean().optional()
  })
)
