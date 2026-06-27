import User from '#models/user'
import Company from '#models/company'
import LimitException from '#exceptions/limit_exception'
import { DateTime } from 'luxon'
import type { Infer } from '@vinejs/vine/types'
import type { createUserValidator, updateUserValidator } from '#validators/user_validator'
import { syncPermissions } from '../utils/permission_helper.js'

type CreateUserPayload = Infer<typeof createUserValidator>
type UpdateUserPayload = Infer<typeof updateUserValidator>

export default class UserService {
  /**
   * Retorna os usuários apenas do tenant (empresa) logado.
   */
  async index(companyId: string) {
    return User.query()
      .where('companyId', companyId)
      .whereNull('deletedAt')
      .orderBy('name', 'asc')
  }

  /**
   * Retorna um usuário pelo ID garantindo isolamento de tenant.
   */
  async show(companyId: string, userId: string) {
    return User.query()
      .where('id', userId)
      .where('companyId', companyId)
      .whereNull('deletedAt')
      .firstOrFail()
  }

  /**
   * Cria um novo usuário garantindo o isolamento do tenant.
   */
  async store(companyId: string, payload: CreateUserPayload) {
    const company = await Company.query().where('id', companyId).whereNull('deletedAt').firstOrFail()

    const currentUsersCount = await User.query()
      .where('companyId', companyId)
      .whereNull('deletedAt')
      .count('* as total')
      .first()

    const total = Number(currentUsersCount?.$extras.total || 0)
    if (total >= company.maxUsers) {
      throw new LimitException(
        `Você atingiu o limite de usuários cadastrados para sua empresa (máximo ${company.maxUsers}). Se desejar aumentar o limite, por favor entre em contato com o suporte.`
      )
    }

    const { permissions, ...userData } = payload
    const user = await User.create({
      ...userData,
      companyId
    })

    if (permissions) {
      const activePermissions = syncPermissions(permissions)
      if (activePermissions.length > 0) {
        await user.related('permissions').createMany(
          activePermissions.map((key) => ({
            permissionKey: key,
          }))
        )
      }
    }

    return user
  }

  /**
   * Atualiza um usuário garantindo que pertence ao tenant atual.
   */
  async update(companyId: string, userId: string, payload: UpdateUserPayload) {
    const user = await User.query()
      .where('id', userId)
      .where('companyId', companyId)
      .firstOrFail()

    const { is_active, permissions, ...rest } = payload
    const updateData = {
      ...rest,
      ...(is_active !== undefined ? { isActive: is_active } : {})
    }

    user.merge(updateData)
    await user.save()

    if (permissions !== undefined) {
      // Exclui as permissões antigas
      await user.related('permissions').query().delete()
      
      const activePermissions = syncPermissions(permissions)
      if (activePermissions.length > 0) {
        await user.related('permissions').createMany(
          activePermissions.map((key) => ({
            permissionKey: key,
          }))
        )
      }
    }

    return user
  }

  /**
   * Desativa (Soft Delete) um usuário do tenant.
   */
  async destroy(companyId: string, userId: string) {
    const user = await User.query()
      .where('id', userId)
      .where('companyId', companyId)
      .whereNull('deletedAt')
      .firstOrFail()

    user.isActive = false
    user.deletedAt = DateTime.now()
    await user.save()
  }
}

