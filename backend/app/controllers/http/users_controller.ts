import type { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/user_service'
import { createUserValidator, updateUserValidator } from '#validators/user_validator'
import User from '#models/user'
import { unserializePermissions, getDefaultPermissions } from '../../utils/permission_helper.js'

export default class UsersController {
  private userService = new UserService()

  async index({ auth, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    const users = await this.userService.index(companyId)

    return response.ok({
      success: true,
      message: 'Usuários listados com sucesso',
      data: users
    })
  }

  async show({ auth, params, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    const user = await this.userService.show(companyId, params.id)
    await user.load('permissions')

    const dbPermissions = user.permissions ? user.permissions.map((p) => p.permissionKey) : []

    return response.ok({
      success: true,
      message: 'Usuário detalhado com sucesso',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.isActive,
        permissions: unserializePermissions(dbPermissions)
      }
    })
  }

  async permissionsList({ response }: HttpContext) {
    return response.ok({
      success: true,
      data: getDefaultPermissions()
    })
  }

  async store({ auth, request, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    const payload = await request.validateUsing(createUserValidator)

    const user = await this.userService.store(companyId, payload)

    return response.created({
      success: true,
      message: 'Usuário criado com sucesso',
      data: user
    })
  }

  async update({ auth, request, params, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    const payload = await request.validateUsing(updateUserValidator)

    const user = await this.userService.update(companyId, params.id, payload)

    return response.ok({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: user
    })
  }

  async destroy({ auth, params, response }: HttpContext) {
    const companyId = (auth.user as User).companyId

    await this.userService.destroy(companyId, params.id)

    return response.ok({
      success: true,
      message: 'Usuário desativado com sucesso',
      data: {}
    })
  }
}
