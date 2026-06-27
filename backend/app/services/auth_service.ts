import User from '#models/user'
import RefreshToken from '#models/refresh_token'
import jwt from 'jsonwebtoken'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'
import crypto from 'crypto'
import { AUTH_COOKIE_MAX_AGE, getJwtSecret, serializeUser } from '#utils/auth'

export default class AuthService {
  /**
   * Valida credenciais e retorna tokens de acesso + usuário do BD
   */
  async login(email: string, passwordPlain: string) {
    const user = await User.query()
      .where('email', email)
      .where('isActive', true)
      .whereNull('deletedAt')
      .preload('permissions')
      .first()

    if (!user) {
      return null
    }

    const isPasswordValid = await hash.verify(user.password, passwordPlain)
    if (!isPasswordValid) {
      return null
    }

    user.lastLoginAt = DateTime.now()
    await user.save()

    const tokens = await this.generateTokens(user)

    return {
      ...tokens,
      user: serializeUser(user),
    }
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

    const user = await User.query()
      .where('id', refreshToken.userId.toString())
      .preload('permissions')
      .first()

    if (!user || !user.isActive || user.deletedAt) {
      return null
    }

    refreshToken.isRevoked = true
    await refreshToken.save()

    const tokens = await this.generateTokens(user)

    return {
      ...tokens,
      user: serializeUser(user),
    }
  }

  /**
   * Revoga todos os refresh tokens e invalida a sessão ativa
   */
  async logout(userId: string) {
    await RefreshToken.query().where('userId', userId).update({ isRevoked: true })

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
    await RefreshToken.query().where('userId', user.id).update({ isRevoked: true })

    const payload = {
      userId: user.id,
      companyId: user.companyId,
      role: user.role,
    }

    const accessToken = jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' })
    const refreshTokenStr = crypto.randomBytes(40).toString('hex')

    user.token = accessToken
    await user.save()

    await RefreshToken.create({
      userId: user.id,
      token: refreshTokenStr,
      expiresAt: DateTime.now().plus({ days: 7 }),
      isRevoked: false,
    })

    return {
      access_token: accessToken,
      refresh_token: refreshTokenStr,
      expires_in: AUTH_COOKIE_MAX_AGE,
    }
  }
}
