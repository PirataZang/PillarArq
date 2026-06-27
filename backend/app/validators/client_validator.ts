import vine from '@vinejs/vine'

export const createClientValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2),
    email: vine.string().email().trim().optional(),
    phone: vine.string().trim().optional(),
    document: vine.string().trim().optional(),
    address: vine.string().trim().optional(),
    service_rate_per_m2: vine.number().min(0),
    notes: vine.string().trim().optional(),
  })
)

export const updateClientValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).optional(),
    email: vine.string().email().trim().optional(),
    phone: vine.string().trim().optional(),
    document: vine.string().trim().optional(),
    address: vine.string().trim().optional(),
    service_rate_per_m2: vine.number().min(0).optional(),
    notes: vine.string().trim().optional(),
    is_active: vine.boolean().optional(),
  })
)
