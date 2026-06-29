import DocumentTemplate from '#models/document_template'
import Client from '#models/client'
import { DateTime } from 'luxon'
import type { Infer } from '@vinejs/vine/types'
import type {
  createDocumentTemplateValidator,
  updateDocumentTemplateValidator,
} from '#validators/document_template_validator'

type CreatePayload = Infer<typeof createDocumentTemplateValidator>
type UpdatePayload = Infer<typeof updateDocumentTemplateValidator>

export default class DocumentTemplateService {
  private async validateClient(companyId: string, clientId?: number | null) {
    if (!clientId) return null

    await Client.query()
      .where('id', clientId)
      .where('companyId', companyId)
      .whereNull('deletedAt')
      .firstOrFail()

    return clientId
  }

  async index(companyId: string) {
    const templates = await DocumentTemplate.query()
      .where('companyId', companyId)
      .whereNull('deletedAt')
      .preload('client')
      .orderBy('updatedAt', 'desc')

    return templates.map((template) => ({
      id: template.id,
      name: template.name,
      document_type: template.documentType,
      client_id: template.clientId,
      client_name: template.client?.name ?? null,
      content: template.content,
      created_at: template.createdAt?.toISO?.() ?? template.createdAt,
      updated_at: template.updatedAt?.toISO?.() ?? template.updatedAt,
    }))
  }

  async show(companyId: string, templateId: string) {
    const template = await DocumentTemplate.query()
      .where('id', templateId)
      .where('companyId', companyId)
      .whereNull('deletedAt')
      .preload('client')
      .firstOrFail()

    return {
      id: template.id,
      name: template.name,
      document_type: template.documentType,
      client_id: template.clientId,
      client_name: template.client?.name ?? null,
      content: template.content,
      created_at: template.createdAt?.toISO?.() ?? template.createdAt,
      updated_at: template.updatedAt?.toISO?.() ?? template.updatedAt,
    }
  }

  async store(companyId: string, payload: CreatePayload, userId?: string) {
    const clientId = await this.validateClient(companyId, payload.client_id)

    return DocumentTemplate.create({
      companyId,
      clientId: clientId ? String(clientId) : null,
      name: payload.name,
      documentType: payload.document_type ?? 'GERAL',
      content: payload.content as Record<string, unknown>,
      createdBy: userId ?? null,
    })
  }

  async update(companyId: string, templateId: string, payload: UpdatePayload, userId?: string) {
    const template = await DocumentTemplate.query()
      .where('id', templateId)
      .where('companyId', companyId)
      .whereNull('deletedAt')
      .firstOrFail()

    if (payload.client_id !== undefined) {
      const clientId = await this.validateClient(companyId, payload.client_id)
      template.clientId = clientId ? String(clientId) : null
    }

    template.merge({
      ...(payload.name !== undefined ? { name: payload.name } : {}),
      ...(payload.document_type !== undefined ? { documentType: payload.document_type } : {}),
      ...(payload.content !== undefined ? { content: payload.content as Record<string, unknown> } : {}),
      updatedBy: userId ?? null,
    })

    await template.save()
    return template
  }

  async destroy(companyId: string, templateId: string, userId?: string) {
    const template = await DocumentTemplate.query()
      .where('id', templateId)
      .where('companyId', companyId)
      .whereNull('deletedAt')
      .firstOrFail()

    template.deletedAt = DateTime.now()
    template.updatedBy = userId ?? null
    await template.save()
  }
}
