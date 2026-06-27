import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import User from '#models/user'

export default class PermissionMiddleware {
  async handle(ctx: HttpContext, next: NextFn, requiredPermissions?: string[]) {
    const user = ctx.auth?.user as User

    if (!user) {
      return ctx.response.status(401).send({
        success: false,
        message: 'Usuário não autenticado',
        errors: []
      })
    }

    // Usuário is_master tem acesso a tudo sem restrição
    if (user.isMaster) {
      return await next()
    }

    if (requiredPermissions && requiredPermissions.length > 0) {
      if (!user.permissions) {
        await user.load('permissions')
      }

      const hasAll = requiredPermissions.every((perm) =>
        user.permissions.some((p) => p.permissionKey === perm)
      )

      if (!hasAll) {
        return ctx.response.status(403).send({
          success: false,
          message: 'Acesso negado. Permissões insuficientes.',
          errors: []
        })
      }
    }

    await next()
  }
}
