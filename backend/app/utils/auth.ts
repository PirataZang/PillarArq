import env from '#start/env'
import type User from '#models/user'

export const AUTH_COOKIE_NAME = 'pillar_auth'
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 dias em segundos

export function getJwtSecret(): string {
  const jwtSecret = env.get('JWT_SECRET')
  if (jwtSecret) {
    return jwtSecret.release()
  }
  return env.get('APP_KEY').release()
}

export function serializeUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    is_master: user.isMaster,
    company_id: user.companyId,
  }
}

export function unauthorizedResponse() {
  return {
    success: false,
    message: 'Não autenticado',
    errors: [] as string[],
  }
}
