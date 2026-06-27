import Client from '#models/client'
import { DateTime } from 'luxon'
import type { Infer } from '@vinejs/vine/types'
import type { createClientValidator, updateClientValidator } from '#validators/client_validator'

type CreateClientPayload = Infer<typeof createClientValidator>
type UpdateClientPayload = Infer<typeof updateClientValidator>

export default class ClientService {
  async index(companyId: string) {
    return Client.query()
      .where('companyId', companyId)
      .whereNull('deletedAt')
      .orderBy('name', 'asc')
  }

  async show(companyId: string, clientId: string) {
    return Client.query()
      .where('id', clientId)
      .where('companyId', companyId)
      .whereNull('deletedAt')
      .firstOrFail()
  }

  async store(companyId: string, payload: CreateClientPayload, userId?: string) {
    return Client.create({
      name: payload.name,
      email: payload.email ?? null,
      phone: payload.phone ?? null,
      document: payload.document ?? null,
      address: payload.address ?? null,
      serviceRatePerM2: payload.service_rate_per_m2,
      notes: payload.notes ?? null,
      companyId,
      createdBy: userId ?? null,
    })
  }

  async update(companyId: string, clientId: string, payload: UpdateClientPayload, userId?: string) {
    const client = await Client.query()
      .where('id', clientId)
      .where('companyId', companyId)
      .whereNull('deletedAt')
      .firstOrFail()

    const { is_active, service_rate_per_m2, ...rest } = payload

    client.merge({
      ...rest,
      ...(service_rate_per_m2 !== undefined ? { serviceRatePerM2: service_rate_per_m2 } : {}),
      ...(is_active !== undefined ? { isActive: is_active } : {}),
      updatedBy: userId ?? null,
    })

    await client.save()
    return client
  }

  async destroy(companyId: string, clientId: string, userId?: string) {
    const client = await Client.query()
      .where('id', clientId)
      .where('companyId', companyId)
      .whereNull('deletedAt')
      .firstOrFail()

    client.isActive = false
    client.deletedAt = DateTime.now()
    client.updatedBy = userId ?? null
    await client.save()
  }
}
