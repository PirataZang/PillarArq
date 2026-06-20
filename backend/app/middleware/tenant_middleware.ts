import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class TenantMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth?.user
    
    if (!user || !user.companyId) {
      return ctx.response.status(401).send({
        success: false,
        message: 'Contexto de tenant (empresa) não encontrado no usuário',
        errors: []
      })
    }

    // Tenant context is guaranteed to be present from auth middleware
    await next()
  }
}
