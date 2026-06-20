import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class PermissionMiddleware {
  async handle(ctx: HttpContext, next: NextFn, roles?: string[]) {
    const user = ctx.auth?.user

    if (!user) {
      return ctx.response.status(401).send({
        success: false,
        message: 'Usuário não autenticado',
        errors: []
      })
    }

    if (roles && roles.length > 0 && !roles.includes(user.role)) {
      return ctx.response.status(403).send({
        success: false,
        message: 'Acesso negado. Permissões insuficientes.',
        errors: []
      })
    }

    await next()
  }
}
