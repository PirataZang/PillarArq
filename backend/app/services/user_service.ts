import User from '#models/user'
import { DateTime } from 'luxon'

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
   * Cria um novo usuário garantindo o isolamento do tenant.
   */
  async store(companyId: string, payload: any) {
    return User.create({
      ...payload,
      companyId
    })
  }

  /**
   * Atualiza um usuário garantindo que pertence ao tenant atual.
   */
  async update(companyId: string, userId: string, payload: any) {
    const user = await User.query()
      .where('id', userId)
      .where('companyId', companyId)
      .firstOrFail()

    user.merge(payload)
    await user.save()

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
