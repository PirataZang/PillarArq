import vine from '@vinejs/vine'
import { DOCUMENT_TYPES } from '#constants/document_type'

export const createDocumentTemplateValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(255),
    client_id: vine.number().optional(),
    document_type: vine.enum(DOCUMENT_TYPES).optional(),
    content: vine.any(),
  })
)

export const updateDocumentTemplateValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(255).optional(),
    client_id: vine.number().optional().nullable(),
    document_type: vine.enum(DOCUMENT_TYPES).optional(),
    content: vine.any().optional(),
  })
)
