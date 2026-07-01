import User from '#models/user'
import Company from '#models/company'
import LimitException from '#exceptions/limit_exception'
import { Exception } from '@adonisjs/core/exceptions'
import { DateTime } from 'luxon'
import type { Infer } from '@vinejs/vine/types'
import type { createUserValidator, updateUserValidator } from '#validators/user_validator'
import { syncPermissions } from '../utils/permission_helper.js'
import { logSubjectChange } from '#utils/audit_logger'

type CreateUserPayload = Infer<typeof createUserValidator>
type UpdateUserPayload = Infer<typeof updateUserValidator>

async function assertEmailAvailable(email: string, exceptUserId?: string) {
  const query = User.query().where('email', email).whereNull('deletedAt')
  if (exceptUserId) {
    query.whereNot('id', exceptUserId)
  }
  const existing = await query.first()
  if (existing) {
    throw new Exception('Este e-mail já está em uso por outro usuário.', {
      status: 422,
      code: 'E_DUPLICATE_EMAIL',
    })
  }
}

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
    await assertEmailAvailable(userData.email)

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

    if (rest.email) {
      await assertEmailAvailable(rest.email, userId)
    }

    const updateData = {
      ...rest,
      ...(is_active !== undefined ? { isActive: is_active } : {})
    }

    user.merge(updateData)
    await user.save()

    if (permissions !== undefined) {
      const oldPermissions = (await user.related('permissions').query())
        .map((p) => p.permissionKey)
        .sort()

      await user.related('permissions').query().delete()

      const activePermissions = syncPermissions(permissions)
      if (activePermissions.length > 0) {
        await user.related('permissions').createMany(
          activePermissions.map((key) => ({
            permissionKey: key,
          }))
        )
      }

      const newPermissions = [...activePermissions].sort()
      if (JSON.stringify(oldPermissions) !== JSON.stringify(newPermissions)) {
        await logSubjectChange(
          'User',
          user.id,
          'updated',
          { permissions: oldPermissions },
          { permissions: newPermissions },
          user.companyId
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

