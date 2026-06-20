import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim(),
    password: vine.string().minLength(6)
  })
)

export const refreshTokenValidator = vine.compile(
  vine.object({
    refresh_token: vine.string().trim()
  })
)
