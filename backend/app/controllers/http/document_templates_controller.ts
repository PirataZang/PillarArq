import type { HttpContext } from '@adonisjs/core/http'
import DocumentTemplateService from '#services/document_template_service'
import {
  createDocumentTemplateValidator,
  updateDocumentTemplateValidator,
} from '#validators/document_template_validator'
import { getTemplateVariablesByType } from '#constants/document_template_variables'
import type { DocumentType } from '#constants/document_type'
import type { BudgetVariableInput } from '#utils/budget_variables'
import User from '#models/user'

function parseBudgetData(input: Record<string, unknown> | undefined): BudgetVariableInput | null {
  if (!input || typeof input !== 'object') return null

  return {
    work_name: input.work_name as string | undefined,
    work_type: input.work_type as string | undefined,
    built_area: input.built_area as string | number | undefined,
    floors: input.floors as string | number | undefined,
    construction_standard: input.construction_standard as string | undefined,
    location: input.location as string | undefined,
    city_state: input.city_state as string | undefined,
    deadline: input.deadline as string | undefined,
    deadline_months: input.deadline_months as string | number | undefined,
    base_date: input.base_date as string | undefined,
    adjustment_index: input.adjustment_index as string | undefined,
    adjustment_index_other: input.adjustment_index_other as string | undefined,
    complexity: input.complexity as string | undefined,
    materials: Array.isArray(input.materials)
      ? (input.materials as Record<string, unknown>[]).map((item) => ({
          name: String(item.name ?? ''),
          quantity: item.quantity as string | number,
          unit: String(item.unit ?? 'un'),
          unit_price: item.unit_price as string | number,
          supplier: (item.supplier as string | null | undefined) ?? null,
        }))
      : undefined,
  }
}

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

  async variables({ request, response }: HttpContext) {
    const documentType = (request.input('document_type', 'GERAL') as DocumentType) || 'GERAL'

    return response.ok({
      success: true,
      message: 'Template variables listed successfully',
      data: getTemplateVariablesByType(documentType),
    })
  }

  async downloadPdf({ auth, params, request, response }: HttpContext) {
    const user = auth.user as User
    const { default: DocumentTemplatePdfService } = await import(
      '#services/document_template_pdf_service'
    )
    const pdfService = new DocumentTemplatePdfService()
    const { buffer, filename } = await pdfService.generate(user.companyId, user.id, {
      templateId: params.id,
      clientId: request.input('client_id'),
      projectId: request.input('project_id'),
      budgetData: parseBudgetData(request.input('budget_data')),
    })

    response.header('Content-Type', 'application/pdf')
    response.header('Content-Disposition', `attachment; filename="${filename}"`)
    return response.send(buffer)
  }

  async generatePdf({ auth, request, response }: HttpContext) {
    const user = auth.user as User
    const payload = request.only([
      'name',
      'content',
      'client_id',
      'project_id',
      'template_id',
      'budget_data',
    ])
    const { default: DocumentTemplatePdfService } = await import(
      '#services/document_template_pdf_service'
    )
    const pdfService = new DocumentTemplatePdfService()
    const { buffer, filename } = await pdfService.generate(user.companyId, user.id, {
      templateId: payload.template_id,
      name: payload.name,
      content: payload.content,
      clientId: payload.client_id,
      projectId: payload.project_id,
      budgetData: parseBudgetData(payload.budget_data),
    })

    response.header('Content-Type', 'application/pdf')
    response.header('Content-Disposition', `attachment; filename="${filename}"`)
    return response.send(buffer)
  }
}
