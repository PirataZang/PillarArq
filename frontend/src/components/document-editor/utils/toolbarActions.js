export function runOnSelection(editor, fn) {
  if (!editor) return
  const { from, to, empty } = editor.state.selection
  let chain = editor.chain().focus()
  if (!empty) {
    chain = chain.setTextSelection({ from, to })
  }
  fn(chain)
}

const ALIGNABLE_BLOCKS = ['paragraph', 'heading']

function getAlignableBlocksInSelection(state) {
  const { from, to, $from, empty } = state.selection
  const blocks = new Map()

  if (empty) {
    for (let depth = $from.depth; depth > 0; depth--) {
      const node = $from.node(depth)
      if (ALIGNABLE_BLOCKS.includes(node.type.name)) {
        blocks.set($from.before(depth), node)
        break
      }
    }
    return blocks
  }

  state.doc.nodesBetween(from, to, (node, pos, parent) => {
    if (!ALIGNABLE_BLOCKS.includes(node.type.name)) return
    if (parent && parent.type.name === 'listItem') return
    blocks.set(pos, node)
  })

  if (blocks.size === 0) {
    for (let depth = $from.depth; depth > 0; depth--) {
      const node = $from.node(depth)
      if (ALIGNABLE_BLOCKS.includes(node.type.name)) {
        blocks.set($from.before(depth), node)
        break
      }
    }
  }

  return blocks
}

/** Alinha somente o(s) parágrafo(s) da seleção — não a seção inteira */
export function setAlignOnSelection(editor, align) {
  if (!editor) return

  const { state, view } = editor
  const { from, to } = state.selection
  const blocks = getAlignableBlocksInSelection(state)
  if (!blocks.size) return

  let tr = state.tr
  for (const [pos, node] of blocks) {
    tr = tr.setNodeMarkup(pos, undefined, { ...node.attrs, textAlign: align })
  }

  const mappedFrom = tr.mapping.map(from)
  const mappedTo = tr.mapping.map(to)
  tr = tr.setSelection(state.selection.constructor.create(tr.doc, mappedFrom, mappedTo))
  view.dispatch(tr.scrollIntoView())
}

export function isAlignActive(editor, align) {
  if (!editor) return false
  const blocks = getAlignableBlocksInSelection(editor.state)
  if (!blocks.size) return false
  return [...blocks.values()].every((node) => node.attrs.textAlign === align)
}
