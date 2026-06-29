import { Plugin } from '@tiptap/pm/state'
import { getSectionPositions } from './sectionDrag'
import { focusNearestSection } from './documentContent'

const ROOT_ALLOWED = new Set(['sectionBlock', 'horizontalRule'])

export function findSectionDepth($from) {
  for (let depth = $from.depth; depth > 0; depth--) {
    if ($from.node(depth).type.name === 'sectionBlock') return depth
  }
  return null
}

export function isInsideList($from, sectionDepth) {
  for (let depth = $from.depth; depth > sectionDepth; depth--) {
    const name = $from.node(depth).type.name
    if (name === 'listItem' || name === 'bulletList' || name === 'orderedList') return true
  }
  return false
}

/** Enter dentro da seção: sempre cria parágrafo irmão, nunca fora da caixa azul */
export function handleSectionEnter(editor) {
  const { state } = editor
  const { $from, empty } = state.selection
  const sectionDepth = findSectionDepth($from)

  if (sectionDepth === null) {
    if (focusNearestSection(editor, $from.pos)) return true
    return editor.commands.insertSectionBlock()
  }

  if (isInsideList($from, sectionDepth)) {
    return editor.chain().splitListItem('listItem').run()
  }

  const block = $from.parent
  const blockType = block.type.name

  if (blockType === 'heading' && empty && $from.parentOffset === block.content.size) {
    const insertPos = $from.after()
    return editor
      .chain()
      .insertContentAt(insertPos, { type: 'paragraph' })
      .setTextSelection(insertPos + 1)
      .run()
  }

  if (blockType === 'paragraph' || blockType === 'heading') {
    if (!empty || ($from.parentOffset > 0 && $from.parentOffset < block.content.size)) {
      return editor.commands.splitBlock()
    }

    const insertPos = $from.after()
    return editor
      .chain()
      .insertContentAt(insertPos, { type: 'paragraph' })
      .setTextSelection(insertPos + 1)
      .run()
  }

  return editor.commands.splitBlock()
}

/** Garante: parágrafos só dentro de seções; seções nunca vazias */
export function createSectionStructurePlugin() {
  return new Plugin({
    appendTransaction(transactions, _oldState, newState) {
      if (!transactions.some((tr) => tr.docChanged)) return null

      const { doc, schema } = newState
      const paragraph = schema.nodes.paragraph
      const sectionType = schema.nodes.sectionBlock
      if (!paragraph || !sectionType) return null

      const orphans = []
      const sections = []

      doc.forEach((node, pos) => {
        if (node.type.name === 'sectionBlock') {
          sections.push({ pos, node })
        } else if (!ROOT_ALLOWED.has(node.type.name)) {
          orphans.push({ pos, node })
        }
      })

      const emptySections = sections.filter(({ node }) => node.childCount === 0)
      if (!orphans.length && !emptySections.length) return null

      let tr = newState.tr

      for (const { pos } of [...emptySections].sort((a, b) => b.pos - a.pos)) {
        tr = tr.insert(pos + 1, paragraph.create())
      }

      if (orphans.length) {
        const orphanNodes = orphans.map((o) => o.node)

        for (const { pos, node } of [...orphans].sort((a, b) => b.pos - a.pos)) {
          tr = tr.delete(pos, pos + node.nodeSize)
        }

        const docAfterDelete = tr.doc
        const sectionsAfter = []
        docAfterDelete.forEach((node, pos) => {
          if (node.type.name === 'sectionBlock') sectionsAfter.push({ pos, node })
        })

        if (sectionsAfter.length) {
          const target = sectionsAfter[sectionsAfter.length - 1]
          const insertPos = target.pos + target.node.nodeSize - 1
          tr = tr.insert(insertPos, orphanNodes)
        } else {
          tr = tr.insert(0, sectionType.create(null, orphanNodes))
        }
      }

      return tr
    },
  })
}

export function getActiveSectionInsertPos(editor) {
  const { $from } = editor.state.selection

  for (let depth = $from.depth; depth > 0; depth--) {
    if ($from.node(depth).type.name === 'sectionBlock') {
      const section = $from.node(depth)
      return $from.before(depth) + section.nodeSize - 1
    }
  }

  const sections = getSectionPositions(editor)
  if (sections.length) {
    const last = sections[sections.length - 1]
    return last.pos + last.node.nodeSize - 1
  }

  return null
}
