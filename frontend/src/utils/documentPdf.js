import api from '@/services/api'

function extractFilename(disposition) {
  if (!disposition) return null
  const match = disposition.match(/filename="?([^";]+)"?/)
  return match?.[1] ?? null
}

export function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

/**
 * Gera e baixa PDF do template.
 * Com `content`, envia o JSON atual do editor (inclui alterações não salvas).
 */
export async function downloadDocumentPdf({
  templateId,
  name,
  content,
  clientId,
  projectId,
}) {
  const useSavedOnly = templateId && !content

  if (useSavedOnly) {
    const { data, headers } = await api.get(`/document-templates/${templateId}/pdf`, {
      responseType: 'blob',
      timeout: 120000,
      params: {
        client_id: clientId || undefined,
        project_id: projectId || undefined,
      },
    })

    const filename =
      extractFilename(headers['content-disposition']) || `${name || 'documento'}.pdf`
    triggerBlobDownload(data, filename)
    return
  }

  const { data, headers } = await api.post(
    '/document-templates/pdf',
    {
      template_id: templateId || undefined,
      name: name || 'documento',
      content,
      client_id: clientId ? Number(clientId) : undefined,
      project_id: projectId ? Number(projectId) : undefined,
    },
    {
      responseType: 'blob',
      timeout: 120000,
    }
  )

  const filename =
    extractFilename(headers['content-disposition']) || `${name || 'documento'}.pdf`
  triggerBlobDownload(data, filename)
}
