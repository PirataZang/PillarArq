import {
  A4_HEIGHT_PX,
  PAGE_PADDING_PX,
  PAGE_GAP_PX,
} from '../constants/a4'

const PAGE_STRIDE = A4_HEIGHT_PX + PAGE_GAP_PX
const MIN_REMAINING = 48

function pageContentStart(pageIndex) {
  return pageIndex * PAGE_STRIDE + PAGE_PADDING_PX
}

function pageContentEnd(pageIndex) {
  return pageIndex * PAGE_STRIDE + A4_HEIGHT_PX - PAGE_PADDING_PX
}

function getPageIndex(top) {
  if (top < PAGE_PADDING_PX) return 0
  return Math.floor((top - PAGE_PADDING_PX) / PAGE_STRIDE)
}

function splitSectionAtBlock(editor, sectionPos, blockIndex) {
  const { state, view } = editor
  const section = state.doc.nodeAt(sectionPos)
  if (!section || section.type.name !== 'sectionBlock') return false
  if (blockIndex <= 0 || blockIndex >= section.childCount) return false

  const sectionType = state.schema.nodes.sectionBlock
  const firstBlocks = []
  const secondBlocks = []

  section.forEach((child, index) => {
    if (index < blockIndex) firstBlocks.push(child)
    else secondBlocks.push(child)
  })

  if (!secondBlocks.length) return false

  const tr = state.tr.replaceWith(sectionPos, sectionPos + section.nodeSize, [
    sectionType.create(null, firstBlocks),
    sectionType.create(null, secondBlocks),
  ])

  view.dispatch(tr)
  return true
}

/**
 * Divide seções cujo conteúdo ultrapassa o fim da página em duas seções.
 */
export function autoSplitSectionsAtPageBreaks(editor, container) {
  if (!editor?.view || !container) return false

  const { view } = editor
  const containerTop = container.getBoundingClientRect().top
  let changed = false
  let guard = 0

  while (guard < 8) {
    guard += 1
    let splitThisPass = false

    view.state.doc.descendants((node, pos) => {
      if (splitThisPass || node.type.name !== 'sectionBlock' || node.childCount < 2) return

      const dom = view.nodeDOM(pos)
      if (!(dom instanceof HTMLElement)) return

      const sectionTop = dom.getBoundingClientRect().top - containerTop
      const pageIndex = getPageIndex(sectionTop)
      const contentEnd = pageContentEnd(pageIndex)

      if (sectionTop >= contentEnd) return

      const sectionStart = pos + 1
      let offset = 0
      let splitIndex = -1

      node.forEach((child, index) => {
        if (splitIndex !== -1) return
        const blockPos = sectionStart + offset
        const blockDom = view.nodeDOM(blockPos)
        offset += child.nodeSize

        if (!(blockDom instanceof HTMLElement)) return
        const blockBottom = blockDom.getBoundingClientRect().bottom - containerTop
        if (blockBottom > contentEnd + 2) {
          splitIndex = index
        }
      })

      if (splitIndex > 0) {
        splitThisPass = splitSectionAtBlock(editor, pos, splitIndex)
        changed = changed || splitThisPass
      }
    })

    if (!splitThisPass) break
  }

  return changed
}

/**
 * Empurra seções inteiras que não cabem no restante da página para a próxima.
 */
export function applySectionPageBreaks(container) {
  const prose = container?.querySelector('.ProseMirror')
  if (!prose) return

  const sections = [...prose.querySelectorAll('[data-section-block]')]
  sections.forEach((section) => {
    section.style.marginTop = ''
  })

  const containerTop = container.getBoundingClientRect().top

  let changed = true
  let guard = 0

  while (changed && guard < sections.length + 2) {
    changed = false
    guard += 1

    for (const section of sections) {
      const rect = section.getBoundingClientRect()
      const top = rect.top - containerTop
      const height = rect.height
      const pageIndex = getPageIndex(top)
      const contentEnd = pageContentEnd(pageIndex)
      const contentStart = pageContentStart(pageIndex)
      const remaining = contentEnd - top
      const pageCapacity = contentEnd - contentStart

      if (height > pageCapacity) continue
      if (remaining >= height || remaining >= height - MIN_REMAINING) continue

      const nextStart = pageContentStart(pageIndex + 1)
      const marginNeeded = Math.ceil(nextStart - top)
      const currentMargin = parseFloat(section.style.marginTop) || 0

      if (marginNeeded > currentMargin + 1) {
        section.style.marginTop = `${marginNeeded}px`
        changed = true
      }
    }
  }
}

export function layoutSectionsForPages(editor, container) {
  if (!container) return false
  const didSplit = autoSplitSectionsAtPageBreaks(editor, container)
  applySectionPageBreaks(container)
  return didSplit
}
