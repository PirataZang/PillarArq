import type { HttpContext } from '@adonisjs/core/http'
import ClientService from '#services/client_service'
import { createClientValidator, updateClientValidator } from '#validators/client_validator'
import User from '#models/user'

export default class ClientsController {
  private clientService = new ClientService()

  async index({ auth, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    const clients = await this.clientService.index(companyId)

    return response.ok({
      success: true,
      message: 'Clients listed successfully',
      data: clients,
    })
  }

  async show({ auth, params, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    const client = await this.clientService.show(companyId, params.id)

    return response.ok({
      success: true,
      message: 'Client retrieved successfully',
      data: client,
    })
  }

  async store({ auth, request, response }: HttpContext) {
    const user = auth.user as User
    const payload = await request.validateUsing(createClientValidator)
    const client = await this.clientService.store(user.companyId, payload, user.id)

    return response.created({
      success: true,
      message: 'Client created successfully',
      data: client,
    })
  }

  async update({ auth, request, params, response }: HttpContext) {
    const user = auth.user as User
    const payload = await request.validateUsing(updateClientValidator)
    const client = await this.clientService.update(user.companyId, params.id, payload, user.id)

    return response.ok({
      success: true,
      message: 'Client updated successfully',
      data: client,
    })
  }

  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.user as User
    await this.clientService.destroy(user.companyId, params.id, user.id)

    return response.ok({
      success: true,
      message: 'Client deactivated successfully',
      data: {},
    })
  }
}
