import vine from '@vinejs/vine'

export const createDocumentTemplateValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(255),
    client_id: vine.number().optional(),
    content: vine.any(),
  })
)

export const updateDocumentTemplateValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(255).optional(),
    client_id: vine.number().optional().nullable(),
    content: vine.any().optional(),
  })
)
