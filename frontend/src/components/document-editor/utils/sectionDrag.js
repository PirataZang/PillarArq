import { TextSelection } from '@tiptap/pm/state'

export function getSectionPositions(editor) {
  const positions = []
  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === 'sectionBlock') {
      positions.push({ pos, node, size: node.nodeSize })
    }
  })
  return positions
}

export function moveSectionBlock(editor, fromPos, toPos) {
  const { state } = editor
  const node = state.doc.nodeAt(fromPos)
  if (!node || node.type.name !== 'sectionBlock') return false

  const nodeSize = node.nodeSize
  if (toPos >= fromPos && toPos <= fromPos + nodeSize) return false

  let insertPos = toPos
  if (insertPos > fromPos) insertPos -= nodeSize

  const tr = state.tr
  tr.delete(fromPos, fromPos + nodeSize)
  tr.insert(insertPos, node)
  tr.setSelection(TextSelection.near(tr.doc.resolve(Math.min(insertPos + 1, tr.doc.content.size - 1))))
  editor.view.dispatch(tr.scrollIntoView())
  return true
}

export function resolveDropPosition(editor, clientY, excludeEl = null) {
  const view = editor.view
  const sections = [...view.dom.querySelectorAll('[data-section-block]')].filter(
    (el) => el !== excludeEl
  )
  const positions = getSectionPositions(editor)
  if (!positions.length) return null

  if (!sections.length) {
    const last = positions[positions.length - 1]
    return last.pos + last.size
  }

  for (let i = 0; i < sections.length; i++) {
    const rect = sections[i].getBoundingClientRect()
    const midpoint = rect.top + rect.height / 2
    if (clientY < midpoint) {
      return positions[i].pos
    }
  }

  const last = positions[positions.length - 1]
  return last.pos + last.size
}

export function resolveDropIndicatorRect(editor, clientY, excludeEl = null) {
  const canvas = editor.view.dom.closest('.document-editor-content')
  const canvasRect = canvas?.getBoundingClientRect()
  const sections = [...editor.view.dom.querySelectorAll('[data-section-block]')].filter(
    (el) => el !== excludeEl
  )

  const left = canvasRect?.left ?? 0
  const width = canvasRect?.width ?? editor.view.dom.clientWidth

  if (!sections.length) {
    const excludeRect = excludeEl?.getBoundingClientRect()
    return {
      top: excludeRect ? excludeRect.bottom + 8 : (canvasRect?.top ?? 0) + 40,
      left,
      width,
    }
  }

  for (let i = 0; i < sections.length; i++) {
    const rect = sections[i].getBoundingClientRect()
    const midpoint = rect.top + rect.height / 2
    if (clientY < midpoint) {
      return { top: rect.top - 6, left, width }
    }
  }

  const lastRect = sections[sections.length - 1].getBoundingClientRect()
  return { top: lastRect.bottom + 6, left, width }
}

export function startSectionDrag(sourceEl, event) {
  const rect = sourceEl.getBoundingClientRect()
  const ghost = sourceEl.cloneNode(true)

  ghost.classList.add('section-drag-ghost')
  ghost.setAttribute('data-drag-ghost', '')
  ghost.style.width = `${rect.width}px`

  const toolbar = ghost.querySelector('.section-block-toolbar-area')
  toolbar?.remove()

  document.body.appendChild(ghost)

  const offsetX = event.clientX - rect.left
  const offsetY = event.clientY - rect.top

  sourceEl.classList.add('section-block--source-dragging')

  const indicator = document.createElement('div')
  indicator.className = 'section-drop-indicator'
  document.body.appendChild(indicator)

  moveSectionDragGhost({ ghost, offsetX, offsetY }, event)

  return { ghost, offsetX, offsetY, sourceEl, indicator }
}

export function moveSectionDragGhost(dragState, event) {
  if (!dragState?.ghost) return
  dragState.ghost.style.left = `${event.clientX - dragState.offsetX}px`
  dragState.ghost.style.top = `${event.clientY - dragState.offsetY}px`
}

export function updateSectionDropIndicator(dragState, editor, event) {
  if (!dragState?.indicator) return
  const rect = resolveDropIndicatorRect(editor, event.clientY, dragState.sourceEl)
  dragState.indicator.style.top = `${rect.top}px`
  dragState.indicator.style.left = `${rect.left}px`
  dragState.indicator.style.width = `${rect.width}px`
}

export function endSectionDrag(dragState) {
  if (!dragState) return
  dragState.ghost?.remove()
  dragState.indicator?.remove()
  dragState.sourceEl?.classList.remove('section-block--source-dragging')
}
