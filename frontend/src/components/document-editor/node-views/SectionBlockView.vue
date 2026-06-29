<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'
import DocumentBlockToolbar from '../DocumentBlockToolbar.vue'
import {
  endSectionDrag,
  moveSectionBlock,
  moveSectionDragGhost,
  resolveDropPosition,
  startSectionDrag,
  updateSectionDropIndicator,
} from '../utils/sectionDrag'

const props = defineProps({
  editor: { type: Object, required: true },
  node: { type: Object, required: true },
  selected: { type: Boolean, default: false },
  deleteNode: { type: Function, default: null },
  getPos: { type: Function, default: null },
})

const selectionTick = ref(0)
const isDragging = ref(false)

let dragFromPos = null
let dragState = null

const isActive = computed(() => {
  selectionTick.value

  if (props.selected) return true

  const pos = props.getPos?.()
  if (pos === undefined || pos === null) return false

  const { from, to } = props.editor.state.selection
  const node = props.editor.state.doc.nodeAt(pos)
  if (!node) return false

  const start = pos + 1
  const end = pos + node.nodeSize - 1
  return from >= start && to <= end
})

const showToolbar = computed(() => isActive.value && !isDragging.value)

const onSelectionUpdate = () => {
  selectionTick.value++
}

const onPointerMove = (event) => {
  if (!dragState) return
  moveSectionDragGhost(dragState, event)
  updateSectionDropIndicator(dragState, props.editor, event)
}

const onPointerUp = (event) => {
  if (dragFromPos === null) return

  const toPos = resolveDropPosition(props.editor, event.clientY, dragState?.sourceEl)
  if (toPos !== null) {
    moveSectionBlock(props.editor, dragFromPos, toPos)
  }

  endSectionDrag(dragState)
  dragState = null
  dragFromPos = null
  isDragging.value = false
  document.body.classList.remove('section-drag-active')
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
}

const startDrag = (event) => {
  event.preventDefault()
  event.stopPropagation()

  const pos = props.getPos?.()
  const sourceEl = pos != null ? props.editor.view.nodeDOM(pos) : null
  if (pos === undefined || pos === null || !(sourceEl instanceof HTMLElement)) return

  dragFromPos = pos
  isDragging.value = true
  dragState = startSectionDrag(sourceEl, event)
  document.body.classList.add('section-drag-active')
  updateSectionDropIndicator(dragState, props.editor, event)

  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
}

onMounted(() => {
  props.editor.on('selectionUpdate', onSelectionUpdate)
  props.editor.on('transaction', onSelectionUpdate)
})

onBeforeUnmount(() => {
  props.editor.off('selectionUpdate', onSelectionUpdate)
  props.editor.off('transaction', onSelectionUpdate)
  endSectionDrag(dragState)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
})
</script>

<template>
  <NodeViewWrapper
    class="section-block group relative my-4 overflow-hidden rounded-lg border border-sky-200 bg-sky-50/60 transition-all"
    :class="[
      isActive && !isDragging ? 'ring-2 ring-sky-400 shadow-sm z-10' : 'hover:border-sky-300',
      isDragging ? 'opacity-60' : '',
    ]"
    data-section-block
  >
    <div
      v-show="showToolbar"
      class="section-block-toolbar-area flex items-center gap-2 border-b border-sky-200 bg-white/90 px-2 py-1.5"
      contenteditable="false"
    >
      <div
        class="section-drag-handle flex h-8 w-8 shrink-0 cursor-grab items-center justify-center rounded-md border border-marble-200 bg-white text-marble-500 shadow-sm active:cursor-grabbing"
        data-section-drag-handle
        title="Arrastar seção"
        @pointerdown="startDrag"
      >
        <i class="fa-solid fa-grip text-sm" />
      </div>

      <DocumentBlockToolbar :editor="editor" class="min-w-0 flex-1" />

      <button
        type="button"
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-red-200 bg-white text-red-500 shadow-sm hover:bg-red-50"
        title="Remover seção"
        @mousedown.prevent
        @click="deleteNode?.()"
      >
        <i class="fa-solid fa-trash text-sm" />
      </button>
    </div>

    <div class="section-block-content cursor-text px-5 py-4">
      <NodeViewContent />
    </div>
  </NodeViewWrapper>
</template>
