import env from '#start/env'

const MM_TO_INCH = 1 / 25.4

function mmToInch(mm: number): string {
  return (mm * MM_TO_INCH).toFixed(4)
}

function getGotenbergUrl(): string {
  return env.get('GOTENBERG_URL') ?? 'http://gotenberg:3000'
}

export async function htmlToPdfBuffer(html: string): Promise<Buffer> {
  const formData = new FormData()
  formData.append('files', new Blob([html], { type: 'text/html; charset=utf-8' }), 'index.html')
  formData.append('paperWidth', '8.27')
  formData.append('paperHeight', '11.7')
  formData.append('marginTop', mmToInch(20))
  formData.append('marginBottom', mmToInch(20))
  formData.append('marginLeft', mmToInch(15))
  formData.append('marginRight', mmToInch(15))
  formData.append('printBackground', 'true')
  formData.append('preferCssPageSize', 'true')

  const baseUrl = getGotenbergUrl().replace(/\/$/, '')
  const response = await fetch(`${baseUrl}/forms/chromium/convert/html`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const details = await response.text().catch(() => '')
    throw new Error(`Falha ao gerar PDF no Gotenberg (${response.status}): ${details}`)
  }

  return Buffer.from(await response.arrayBuffer())
}
