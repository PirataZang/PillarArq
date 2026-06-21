import type { HttpContext } from '@adonisjs/core/http'
import AuthService from '#services/auth_service'
import { loginValidator, refreshTokenValidator } from '#validators/auth_validator'
import User from '#models/user'

export default class AuthController {
  private authService = new AuthService()

  async login({ request, response }: HttpContext) {
    const payload = await request.validateUsing(loginValidator)

    const result = await this.authService.login(payload.email, payload.password)

    if (!result) {
      return response.status(401).send({
        success: false,
        message: 'Credenciais inválidas',
        errors: []
      })
    }

    return response.ok({
      success: true,
      message: 'Login realizado com sucesso',
      data: result
    })
  }

  async refresh({ request, response }: HttpContext) {
    const payload = await request.validateUsing(refreshTokenValidator)

    const result = await this.authService.refresh(payload.refresh_token)

    if (!result) {
      return response.status(401).send({
        success: false,
        message: 'Refresh token inválido ou expirado',
        errors: []
      })
    }

    return response.ok({
      success: true,
      message: 'Token atualizado com sucesso',
      data: result
    })
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.user as User
    await this.authService.logout(user.id)

    return response.ok({
      success: true,
      message: 'Logout realizado com sucesso',
      data: {}
    })
  }

  async me({ auth, response }: HttpContext) {
    const user = auth.user as User

    return response.ok({
      success: true,
      message: 'Dados do usuário autenticado',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_master: user.isMaster,
        company_id: user.companyId
      }
    })
  }
}
