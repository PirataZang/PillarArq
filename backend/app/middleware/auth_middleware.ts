import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import jwt from 'jsonwebtoken'
import env from '#start/env'
import User from '#models/user'

export default class AuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const authHeader = ctx.request.header('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ctx.response.status(401).send({
        success: false,
        message: 'Token não fornecido ou formato inválido',
        errors: []
      })
    }

    const token = authHeader.split(' ')[1]

    try {
      const decoded = jwt.verify(token, env.get('APP_KEY').release()) as any
      
      const user = await User.find(decoded.userId)
      if (!user || !user.isActive || user.deletedAt) {
        return ctx.response.status(401).send({
          success: false,
          message: 'Usuário não encontrado, inativo ou excluído',
          errors: []
        })
      }

      // Verifica se o token enviado corresponde ao token ativo armazenado no banco de dados (controle de sessão única)
      if (!user.token || user.token !== token) {
        return ctx.response.status(401).send({
          success: false,
          message: 'Sessão inválida ou expirada. Por favor, faça login novamente.',
          errors: []
        })
      }

      ctx.auth = { user } as any

      await next()
    } catch (error) {
      return ctx.response.status(401).send({
        success: false,
        message: 'Token inválido ou expirado',
        errors: []
      })
    }
  }
}
