import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import User from '#models/user'
import { setAuditCompanyId } from '#utils/audit_context'

export default class TenantMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth?.user as User
    
    if (!user) {
      return ctx.response.status(401).send({
        success: false,
        message: 'Usuário não autenticado',
        errors: []
      })
    }

    // Se o usuário for master, ele pode enviar um cabeçalho X-Company-Id para trocar o contexto da requisição
    if (user.isMaster) {
      const headerCompanyId = ctx.request.header('x-company-id')
      if (headerCompanyId && headerCompanyId !== 'all') {
        user.companyId = headerCompanyId
      }
    }

    if (!user.companyId) {
      return ctx.response.status(401).send({
        success: false,
        message: 'Contexto de tenant (empresa) não encontrado no usuário',
        errors: []
      })
    }

    setAuditCompanyId(user.companyId)

    await next()
  }
}
