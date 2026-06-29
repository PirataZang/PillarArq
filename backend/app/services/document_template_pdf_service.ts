import DocumentTemplate from '#models/document_template'
import { renderDocumentHtml } from '#utils/document_html_renderer'
import { htmlToPdfBuffer } from '#utils/gotenberg_pdf'
import {
  buildDocumentVariableContext,
  type DocumentVariableContextOptions,
} from '#utils/document_variable_resolver'
import type { BudgetVariableInput } from '#utils/budget_variables'

function sanitizeFilename(name: string): string {
  const cleaned = name
    .trim()
    .replace(/[^\w\s-áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80)

  return cleaned || 'documento'
}

export interface GeneratePdfOptions extends DocumentVariableContextOptions {
  content?: Record<string, unknown> | null
  name?: string
  budgetData?: BudgetVariableInput | null
}

export default class DocumentTemplatePdfService {
  async generate(
    companyId: string,
    userId: string,
    options: GeneratePdfOptions & { templateId?: string }
  ): Promise<{ buffer: Buffer; filename: string }> {
    let name = options.name?.trim() || 'documento'
    let content = options.content ?? null
    let clientId = options.clientId
    const projectId = options.projectId

    if (options.templateId) {
      const template = await DocumentTemplate.query()
        .where('id', options.templateId)
        .where('companyId', companyId)
        .whereNull('deletedAt')
        .firstOrFail()

      name = options.name?.trim() || template.name
      content = (options.content as Record<string, unknown> | undefined) ?? template.content

      if (!clientId && template.clientId) {
        clientId = template.clientId
      }
    }

    if (!content) {
      content = {
        type: 'doc',
        content: [{ type: 'sectionBlock', content: [{ type: 'paragraph' }] }],
      }
    }

    const variables = await buildDocumentVariableContext(companyId, userId, {
      clientId,
      projectId,
      budgetData: options.budgetData,
    })

    const html = renderDocumentHtml(content, variables, name)
    const buffer = await htmlToPdfBuffer(html)

    return {
      buffer,
      filename: `${sanitizeFilename(name)}.pdf`,
    }
  }
}
