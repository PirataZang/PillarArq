import { getSectionPositions } from './sectionDrag'

export const EMPTY_DOCUMENT_CONTENT = {
  type: 'doc',
  content: [
    {
      type: 'sectionBlock',
      content: [{ type: 'paragraph' }],
    },
  ],
}

const ROOT_ALLOWED = new Set(['sectionBlock', 'horizontalRule'])

/** Converte parágrafos soltos na raiz em seções */
export function normalizeDocumentContent(json) {
  if (!json?.content?.length) return EMPTY_DOCUMENT_CONTENT

  const needsNormalize = json.content.some((node) => !ROOT_ALLOWED.has(node.type))
  if (!needsNormalize) return json

  const result = []
  let buffer = []

  const flush = () => {
    if (!buffer.length) return
    result.push({ type: 'sectionBlock', content: buffer })
    buffer = []
  }

  for (const node of json.content) {
    if (node.type === 'horizontalRule') {
      flush()
      result.push(node)
    } else if (node.type === 'sectionBlock') {
      flush()
      result.push(node)
    } else {
      buffer.push(node)
    }
  }
  flush()

  return result.length ? { type: 'doc', content: result } : EMPTY_DOCUMENT_CONTENT
}

export function insertInActiveSection(editor, nodes) {
  if (!editor) return false

  const content = Array.isArray(nodes) ? nodes : [nodes]
  const { $from, empty } = editor.state.selection

  for (let depth = $from.depth; depth > 0; depth--) {
    if ($from.node(depth).type.name === 'sectionBlock') {
      const block = $from.parent
      const blockType = block.type.name

      if (
        empty &&
        (blockType === 'paragraph' || blockType === 'heading') &&
        $from.parentOffset === block.content.size
      ) {
        const insertPos = $from.after()
        return editor
          .chain()
          .insertContentAt(insertPos, content)
          .setTextSelection(insertPos + 1)
          .run()
      }

      const section = $from.node(depth)
      const sectionStart = $from.before(depth)
      const insertPos = sectionStart + section.nodeSize - 1
      return editor.chain().insertContentAt(insertPos, content).focus(insertPos + 1).run()
    }
  }

  const sections = getSectionPositions(editor)
  if (sections.length) {
    const last = sections[sections.length - 1]
    const insertPos = last.pos + last.node.nodeSize - 1
    return editor.chain().insertContentAt(insertPos, content).focus(insertPos + 1).run()
  }

  const end = editor.state.doc.content.size
  return editor
    .chain()
    .insertContentAt(end, { type: 'sectionBlock', content })
    .focus(end + 2)
    .run()
}

export function focusNearestSection(editor, docPos) {
  const { doc } = editor.state
  let target = null

  doc.descendants((node, pos) => {
    if (node.type.name === 'sectionBlock' && pos <= docPos) {
      target = pos
    }
  })

  if (target === null) {
    const sections = getSectionPositions(editor)
    if (sections.length) target = sections[0].pos
  }

  if (target === null) return false

  return editor.chain().focus(target + 1).run()
}
