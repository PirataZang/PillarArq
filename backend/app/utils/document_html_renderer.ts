import { generateHTML } from '@tiptap/html'
import { createDocumentPdfExtensions } from '#utils/document_tiptap_extensions'
import { BUDGET_HTML_VARIABLE_KEYS } from '#utils/budget_materials_table'

const EMPTY_DOCUMENT = {
  type: 'doc',
  content: [
    {
      type: 'sectionBlock',
      content: [{ type: 'paragraph' }],
    },
  ],
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function resolveVariablesInHtml(html: string, variables: Record<string, string>): string {
  let result = html

  for (const key of BUDGET_HTML_VARIABLE_KEYS) {
    const value = variables[key]
    if (!value) continue
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    result = result.replace(
      new RegExp(`<span[^>]*>\\s*\\{\\{${escapedKey}\\}\\}\\s*</span>`, 'gi'),
      value
    )
  }

  return result.replace(/\{\{([^}]+)\}\}/g, (_match, key: string) => {
    const trimmed = key.trim()
    const value = variables[trimmed]
    if (value === undefined || value === null || value === '') {
      return `<span class="template-variable-missing">{{${trimmed}}}</span>`
    }
    if (BUDGET_HTML_VARIABLE_KEYS.has(trimmed)) {
      return value
    }
    return escapeHtml(value)
  })
}

export function renderDocumentBodyHtml(content: Record<string, unknown> | null | undefined): string {
  const doc = content && typeof content === 'object' ? content : EMPTY_DOCUMENT
  const html = generateHTML(doc, createDocumentPdfExtensions())
  return html.trim()
}

/** Seções são containers do editor — no PDF exportamos só o conteúdo interno */
export function flattenSectionsForPdf(html: string): string {
  let result = html
  let previous = ''

  while (result !== previous) {
    previous = result
    result = result.replace(
      /<section[^>]*\bdata-section-block\b[^>]*>([\s\S]*?)<\/section>/gi,
      '$1'
    )
  }

  return result.replace(/<p[^>]*>\s*<\/p>/gi, '').trim()
}

export function wrapDocumentHtml(bodyHtml: string, title: string): string {
  const safeTitle = escapeHtml(title || 'Documento')

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>${safeTitle}</title>
  <style>
    @page {
      size: A4;
      margin: 20mm 15mm;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
      color: #1c1917;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
    }

    .document-body {
      width: 100%;
    }

    h1 {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0.5rem 0 1rem;
    }

    h2 {
      font-size: 1.35rem;
      font-weight: 700;
      margin: 0.5rem 0 0.75rem;
    }

    h3 {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0.5rem 0 0.5rem;
    }

    p {
      margin: 0.35rem 0;
    }

    ul,
    ol {
      padding-left: 1.5rem;
      margin: 0.5rem 0;
    }

    blockquote {
      border-left: 3px solid #d6d3d1;
      padding-left: 1rem;
      color: #57534e;
      margin: 0.75rem 0;
    }

    hr {
      border: none;
      border-top: 1px solid #d6d3d1;
      margin: 1.25rem 0;
    }

    .template-variable,
    .template-variable-missing {
      font-family: ui-monospace, monospace;
      font-size: 0.9em;
      color: #0369a1;
      background: #e0f2fe;
      padding: 0 4px;
      border-radius: 4px;
    }

    .template-variable-missing {
      color: #b45309;
      background: #fef3c7;
    }

    mark {
      border-radius: 2px;
      padding: 0 2px;
    }

    .budget-materials-table-wrap {
      margin: 1rem 0;
      overflow-x: auto;
    }

    .budget-materials-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10pt;
    }

    .budget-materials-table th,
    .budget-materials-table td {
      border: 1px solid #d6d3d1;
      padding: 0.45rem 0.55rem;
      text-align: left;
      vertical-align: top;
    }

    .budget-materials-table th {
      background: #f5f5f4;
      font-weight: 600;
      color: #44403c;
    }

    .budget-materials-table td.num,
    .budget-materials-table th.num {
      text-align: right;
      white-space: nowrap;
    }

    .budget-materials-table tfoot td {
      background: #fafaf9;
      border-top: 2px solid #a8a29e;
    }

    .budget-table-empty {
      color: #78716c;
      font-style: italic;
      margin: 0.75rem 0;
    }

    section[data-section-block],
    .pdf-section {
      break-inside: avoid;
      page-break-inside: avoid;
      margin: 0 0 1rem;
    }

    section[data-section-block] > :first-child,
    .pdf-section > :first-child {
      margin-top: 0;
    }

    section[data-section-block] > :last-child,
    .pdf-section > :last-child {
      margin-bottom: 0;
    }
  </style>
</head>
<body>
  <div class="document-body">
    ${bodyHtml}
  </div>
</body>
</html>`
}

export function renderDocumentHtml(
  content: Record<string, unknown> | null | undefined,
  variables: Record<string, string>,
  title: string
): string {
  const bodyHtml = renderDocumentBodyHtml(content)
  const resolvedBody = resolveVariablesInHtml(bodyHtml, variables)
  return wrapDocumentHtml(resolvedBody, title)
}
