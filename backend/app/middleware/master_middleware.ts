import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import User from '#models/user'

export default class MasterMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth?.user as User

    if (!user) {
      return ctx.response.status(401).send({
        success: false,
        message: 'Usuário não autenticado',
        errors: []
      })
    }

    if (!user.isMaster) {
      return ctx.response.status(403).send({
        success: false,
        message: 'Acesso negado. Apenas usuários master possuem essa permissão.',
        errors: []
      })
    }

    await next()
  }
}
