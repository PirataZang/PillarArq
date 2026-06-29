import type { HttpContext } from '@adonisjs/core/http'
import DocumentTemplateService from '#services/document_template_service'
import {
  createDocumentTemplateValidator,
  updateDocumentTemplateValidator,
} from '#validators/document_template_validator'
import User from '#models/user'

const TEMPLATE_VARIABLES = [
  {
    id: 'company',
    label: 'Empresa',
    items: [
      { key: 'company.name', label: 'Nome da Empresa' },
      { key: 'company.document', label: 'CNPJ' },
      { key: 'company.address', label: 'Endereço' },
    ],
  },
  {
    id: 'user',
    label: 'Usuário',
    items: [
      { key: 'user.name', label: 'Nome do Usuário' },
      { key: 'user.email', label: 'E-mail do Usuário' },
      { key: 'user.phone', label: 'Telefone' },
    ],
  },
  {
    id: 'client',
    label: 'Cliente',
    items: [
      { key: 'client.name', label: 'Nome do Cliente' },
      { key: 'client.email', label: 'E-mail do Cliente' },
      { key: 'client.phone', label: 'Telefone do Cliente' },
      { key: 'client.document', label: 'Documento' },
      { key: 'client.address', label: 'Endereço' },
    ],
  },
  {
    id: 'project',
    label: 'Obra',
    items: [
      { key: 'project.name', label: 'Nome da Obra' },
      { key: 'project.address', label: 'Endereço da Obra' },
      { key: 'project.status', label: 'Status' },
      { key: 'project.total_budget', label: 'Orçamento Total' },
      { key: 'project.start_date', label: 'Data de Início' },
    ],
  },
  {
    id: 'proposal',
    label: 'Proposta',
    items: [
      { key: 'proposal.total', label: 'Valor Total' },
      { key: 'proposal.date', label: 'Data de Emissão' },
    ],
  },
]

export default class DocumentTemplatesController {
  private templateService = new DocumentTemplateService()

  async index({ auth, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    const templates = await this.templateService.index(companyId)

    return response.ok({
      success: true,
      message: 'Document templates listed successfully',
      data: templates,
    })
  }

  async show({ auth, params, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    const template = await this.templateService.show(companyId, params.id)

    return response.ok({
      success: true,
      message: 'Document template retrieved successfully',
      data: template,
    })
  }

  async store({ auth, request, response }: HttpContext) {
    const user = auth.user as User
    const payload = await request.validateUsing(createDocumentTemplateValidator)
    const template = await this.templateService.store(user.companyId, payload, user.id)

    return response.created({
      success: true,
      message: 'Document template created successfully',
      data: template,
    })
  }

  async update({ auth, request, params, response }: HttpContext) {
    const user = auth.user as User
    const payload = await request.validateUsing(updateDocumentTemplateValidator)
    const template = await this.templateService.update(user.companyId, params.id, payload, user.id)

    return response.ok({
      success: true,
      message: 'Document template updated successfully',
      data: template,
    })
  }

  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.user as User
    await this.templateService.destroy(user.companyId, params.id, user.id)

    return response.ok({
      success: true,
      message: 'Document template deleted successfully',
    })
  }

  async variables({ response }: HttpContext) {
    return response.ok({
      success: true,
      message: 'Template variables listed successfully',
      data: TEMPLATE_VARIABLES,
    })
  }
}
