import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import jwt from 'jsonwebtoken'
import User from '#models/user'
import { AUTH_COOKIE_NAME, getJwtSecret, unauthorizedResponse } from '#utils/auth'

function extractToken(ctx: HttpContext): string | null {
  const cookieToken = ctx.request.cookie(AUTH_COOKIE_NAME)
  if (cookieToken) {
    return cookieToken
  }

  const authHeader = ctx.request.header('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.split(' ')[1]
  }

  return null
}

export default class AuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const token = extractToken(ctx)

    if (!token) {
      return ctx.response.status(401).send(unauthorizedResponse())
    }

    try {
      const decoded = jwt.verify(token, getJwtSecret()) as {
        userId: string
        exp?: number
      }

      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        return ctx.response.status(401).send(unauthorizedResponse())
      }

      const user = await User.find(decoded.userId)
      if (!user || !user.isActive || user.deletedAt) {
        return ctx.response.status(401).send(unauthorizedResponse())
      }

      if (!user.token || user.token !== token) {
        return ctx.response.status(401).send(unauthorizedResponse())
      }

      ctx.auth = { user }

      await next()
    } catch {
      return ctx.response.status(401).send(unauthorizedResponse())
    }
  }
}
