import User from '#models/user'
import RefreshToken from '#models/refresh_token'
import jwt from 'jsonwebtoken'
import env from '#start/env'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'
import crypto from 'crypto'

export default class AuthService {
  /**
   * Valida credenciais e retorna tokens de acesso
   */
  async login(email: string, passwordPlain: string) {
    const user = await User.query()
      .where('email', email)
      .where('isActive', true)
      .whereNull('deletedAt')
      .first()

    if (!user) {
      return null
    }

    const isPasswordValid = await hash.verify(user.password, passwordPlain)
    if (!isPasswordValid) {
      return null
    }

    // Atualiza o último login
    user.lastLoginAt = DateTime.now()
    await user.save()

    return this.generateTokens(user)
  }

  /**
   * Valida o refresh token e emite novos tokens
   */
  async refresh(refreshTokenStr: string) {
    const refreshToken = await RefreshToken.query()
      .where('token', refreshTokenStr)
      .where('isRevoked', false)
      .where('expiresAt', '>', DateTime.now().toSQL() as string)
      .first()

    if (!refreshToken) {
      return null
    }

    const user = await User.find(refreshToken.userId)
    if (!user || !user.isActive || user.deletedAt) {
      return null
    }

    // Revoga o refresh token usado
    refreshToken.isRevoked = true
    await refreshToken.save()

    return this.generateTokens(user)
  }

  /**
   * Revoga todos os refresh tokens de um usuário ou um específico
   */
  async logout(userId: string) {
    await RefreshToken.query()
      .where('userId', userId)
      .update({ isRevoked: true })

    const user = await User.find(userId)
    if (user) {
      user.token = null
      await user.save()
    }
  }

  /**
   * Gera Access Token (7d) e Refresh Token (7d)
   */
  private async generateTokens(user: User) {
    const payload = {
      userId: user.id,
      companyId: user.companyId,
      role: user.role
    }

    const accessToken = jwt.sign(payload, env.get('APP_KEY').release(), { expiresIn: '7d' })
    const refreshTokenStr = crypto.randomBytes(40).toString('hex')

    // Salva o token de acesso ativo no usuário para controle de sessão única
    user.token = accessToken
    await user.save()

    // Salva o Refresh Token no banco de dados para revogação e validação
    await RefreshToken.create({
      userId: user.id,
      token: refreshTokenStr,
      expiresAt: DateTime.now().plus({ days: 7 }),
      isRevoked: false
    })

    return {
      access_token: accessToken,
      refresh_token: refreshTokenStr,
      expires_in: 604800 // 7 dias em segundos
    }
  }
}
