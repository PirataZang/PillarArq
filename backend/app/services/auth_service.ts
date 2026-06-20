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
  }

  /**
   * Gera Access Token (15m) e Refresh Token (7d)
   */
  private async generateTokens(user: User) {
    const payload = {
      userId: user.id,
      companyId: user.companyId,
      role: user.role
    }

    const accessToken = jwt.sign(payload, env.get('APP_KEY'), { expiresIn: '15m' })
    const refreshTokenStr = crypto.randomBytes(40).toString('hex')

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
      expires_in: 900 // 15 minutos em segundos
    }
  }
}
