import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import AuthService from '#services/auth_service'
import { loginValidator, refreshTokenValidator } from '#validators/auth_validator'
import User from '#models/user'
import { AUTH_COOKIE_MAX_AGE, AUTH_COOKIE_NAME, serializeUser } from '#utils/auth'

const authCookieOptions = {
  httpOnly: true,
  maxAge: AUTH_COOKIE_MAX_AGE,
  sameSite: 'lax' as const,
  secure: app.inProduction,
  path: '/',
}

export default class AuthController {
  private authService = new AuthService()

  async login({ request, response }: HttpContext) {
    const payload = await request.validateUsing(loginValidator)

    const result = await this.authService.login(payload.email, payload.password)

    if (!result) {
      return response.status(401).send({
        success: false,
        message: 'Credenciais inválidas',
        errors: [],
      })
    }

    response.cookie(AUTH_COOKIE_NAME, result.access_token, authCookieOptions)

    return response.ok({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: result.user,
        expires_in: result.expires_in,
      },
    })
  }

  async refresh({ request, response }: HttpContext) {
    const payload = await request.validateUsing(refreshTokenValidator)

    const result = await this.authService.refresh(payload.refresh_token)

    if (!result) {
      return response.status(401).send({
        success: false,
        message: 'Refresh token inválido ou expirado',
        errors: [],
      })
    }

    response.cookie(AUTH_COOKIE_NAME, result.access_token, authCookieOptions)

    return response.ok({
      success: true,
      message: 'Token atualizado com sucesso',
      data: {
        user: result.user,
        expires_in: result.expires_in,
      },
    })
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.user as User
    await this.authService.logout(user.id)

    response.clearCookie(AUTH_COOKIE_NAME, { path: '/' })

    return response.ok({
      success: true,
      message: 'Logout realizado com sucesso',
      data: {},
    })
  }

  async me({ auth, response }: HttpContext) {
    const user = auth.user as User
    await user.load('permissions')

    return response.ok({
      success: true,
      message: 'Dados do usuário autenticado',
      data: serializeUser(user),
    })
  }
}
