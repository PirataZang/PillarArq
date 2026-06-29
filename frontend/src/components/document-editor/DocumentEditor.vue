<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { TextSelection } from '@tiptap/pm/state'
import DocumentEditorSidebar from './DocumentEditorSidebar.vue'
import { createDocumentExtensions, DEFAULT_DOCUMENT_CONTENT } from './extensions'
import { normalizeDocumentContent } from './utils/documentContent'
import {
  A4_WIDTH_PX,
  A4_HEIGHT_PX,
  PAGE_PADDING_PX,
  PAGE_CONTENT_HEIGHT,
  PAGE_GAP_PX,
} from './constants/a4'
import { applySectionPageBreaks, layoutSectionsForPages } from './utils/sectionPageBreaks'

const props = defineProps({
  modelValue: { type: Object, default: null },
  title: { type: String, default: 'Novo Template' },
  documentType: { type: String, default: 'GERAL' },
})

const emit = defineEmits(['update:modelValue', 'save', 'preview', 'download'])

const saveStatus = ref('Salvo')
const pageCount = ref(1)
const contentRef = ref(null)
let resizeObserver = null
let applyingPageLayout = false
let measureTimer = null

const runPageLayout = () => {
  if (!contentRef.value || applyingPageLayout || !editor.value) return

  applyingPageLayout = true
  const didSplit = layoutSectionsForPages(editor.value, contentRef.value)

  const prose = contentRef.value.querySelector('.ProseMirror')
  const height = prose?.scrollHeight ?? 0
  pageCount.value = Math.max(1, Math.ceil(height / PAGE_CONTENT_HEIGHT))

  if (didSplit) {
    emit('update:modelValue', editor.value.getJSON())
  }

  nextTick(() => {
    applySectionPageBreaks(contentRef.value)
    applyingPageLayout = false
  })
}

const updatePageCount = () => {
  const prose = contentRef.value?.querySelector('.ProseMirror')
  if (!prose) {
    pageCount.value = 1
    return
  }
  runPageLayout()
}

const editor = useEditor({
  content: normalizeDocumentContent(props.modelValue ?? DEFAULT_DOCUMENT_CONTENT),
  extensions: createDocumentExtensions(),
  editorProps: {
    attributes: {
      class: 'document-prosemirror outline-none min-h-full',
    },
    handleClick(view, pos) {
      const { doc } = view.state
      const $pos = doc.resolve(pos)

      for (let depth = $pos.depth; depth > 0; depth--) {
        if ($pos.node(depth).type.name === 'sectionBlock') return false
      }

      let target = null
      doc.descendants((node, nodePos) => {
        if (node.type.name === 'sectionBlock' && nodePos <= pos) {
          target = nodePos
        }
      })

      if (target === null) return false

      view.dispatch(
        view.state.tr.setSelection(TextSelection.near(doc.resolve(target + 1))).scrollIntoView()
      )
      return true
    },
  },
  onUpdate: ({ editor: ed }) => {
    if (applyingPageLayout) return
    saveStatus.value = 'Alterado'
    emit('update:modelValue', ed.getJSON())
    schedulePageMeasure()
  },
})

const schedulePageMeasure = () => {
  if (measureTimer) clearTimeout(measureTimer)
  measureTimer = setTimeout(() => {
    nextTick(() => updatePageCount())
  }, 120)
}

watch(
  () => props.modelValue,
  (value) => {
    if (!editor.value || !value) return
    const normalized = normalizeDocumentContent(value)
    const current = JSON.stringify(editor.value.getJSON())
    const incoming = JSON.stringify(normalized)
    if (current !== incoming) {
      editor.value.commands.setContent(normalized, false)
      schedulePageMeasure()
    }
  }
)

onMounted(() => {
  schedulePageMeasure()
  nextTick(() => {
    editor.value?.chain().focus('start').run()
  })
  const prose = () => contentRef.value?.querySelector('.ProseMirror')
  resizeObserver = new ResizeObserver(() => updatePageCount())
  const node = prose()
  if (node) resizeObserver.observe(node)
})

onBeforeUnmount(() => {
  if (measureTimer) clearTimeout(measureTimer)
  resizeObserver?.disconnect()
  editor.value?.destroy()
})

const handleSave = () => {
  if (!editor.value) return
  emit('save', editor.value.getJSON())
  saveStatus.value = 'Salvo'
}

const handlePreview = () => {
  if (!editor.value) return
  emit('preview', editor.value.getJSON())
}

const handleDownload = () => {
  if (!editor.value) return
  emit('download', editor.value.getJSON())
}

defineExpose({
  getJSON: () => editor.value?.getJSON(),
  getHTML: () => editor.value?.getHTML(),
})
</script>

<template>
  <div class="document-editor flex h-[calc(100vh-4rem)] flex-col overflow-hidden rounded-xl border border-marble-200 bg-marble-50">
    <header class="flex shrink-0 items-center justify-between border-b border-marble-200 bg-white px-5 py-3">
      <div class="min-w-0">
        <h1 class="truncate text-lg font-semibold text-marble-900">{{ title }}</h1>
        <p class="text-xs text-marble-500">{{ saveStatus }} · {{ pageCount }} página(s)</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="rounded-lg border border-marble-200 px-4 py-2 text-sm font-medium text-marble-700 hover:bg-marble-50"
          @click="handlePreview"
        >
          Preview
        </button>
        <button
          type="button"
          class="rounded-lg border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 hover:bg-sky-100"
          @click="handleDownload"
        >
          Baixar PDF
        </button>
        <button
          type="button"
          class="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
          @click="handleSave"
        >
          Salvar Template
        </button>
      </div>
    </header>

    <div class="flex min-h-0 flex-1">
      <DocumentEditorSidebar :editor="editor" :document-type="documentType" />

      <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div class="flex-1 overflow-y-auto bg-marble-100 px-6 py-8">
          <div class="mx-auto" :style="{ width: `${A4_WIDTH_PX}px` }">
            <div class="relative">
              <div
                v-for="page in pageCount"
                :key="page"
                class="document-page absolute left-0 right-0 rounded-sm bg-white shadow-md"
                :style="{
                  top: `${(page - 1) * (A4_HEIGHT_PX + PAGE_GAP_PX)}px`,
                  height: `${A4_HEIGHT_PX}px`,
                }"
              >
                <span class="absolute bottom-3 right-4 text-xs text-marble-400">
                  Página {{ page }} de {{ pageCount }}
                </span>
              </div>

              <div
                ref="contentRef"
                class="document-editor-content relative z-10"
                :style="{
                  minHeight: `${pageCount * A4_HEIGHT_PX + (pageCount - 1) * PAGE_GAP_PX}px`,
                  padding: `${PAGE_PADDING_PX}px`,
                }"
              >
                <EditorContent :editor="editor" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.document-prosemirror {
  color: var(--color-marble-900);
  font-size: 0.95rem;
  line-height: 1.6;
  min-height: 200px;
}

/* Impede área editável fora das seções */
.document-prosemirror > :not([data-section-block]):not(hr) {
  display: none;
}

.document-prosemirror h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0.5rem 0 1rem;
}

.document-prosemirror h2 {
  font-size: 1.35rem;
  font-weight: 700;
  margin: 0.5rem 0 0.75rem;
}

.document-prosemirror h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0.5rem 0 0.5rem;
}

.document-prosemirror p {
  margin: 0.35rem 0;
}

.document-prosemirror ul,
.document-prosemirror ol {
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

.document-prosemirror blockquote {
  border-left: 3px solid var(--color-marble-300);
  padding-left: 1rem;
  color: var(--color-marble-600);
  margin: 0.75rem 0;
}

.document-prosemirror hr {
  border: none;
  border-top: 1px solid var(--color-marble-300);
  margin: 1.25rem 0;
}

.document-prosemirror .section-block {
  break-inside: avoid;
  page-break-inside: avoid;
}

.document-prosemirror .section-block p:last-child,
.document-prosemirror .section-block h1:last-child,
.document-prosemirror .section-block h2:last-child,
.document-prosemirror .section-block h3:last-child {
  margin-bottom: 0;
}

.document-prosemirror .section-block p:first-child,
.document-prosemirror .section-block h1:first-child,
.document-prosemirror .section-block h2:first-child,
.document-prosemirror .section-block h3:first-child {
  margin-top: 0;
}

.document-page::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.35), transparent);
  pointer-events: none;
}

/* Drag ghost — seção semi-transparente seguindo o cursor */
.section-drag-ghost {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.5;
  border-radius: 0.5rem;
  border: 2px solid #38bdf8;
  background: rgba(224, 242, 254, 0.85);
  box-shadow: 0 16px 48px rgba(15, 23, 42, 0.18);
  transform: rotate(-0.5deg);
  transition: none;
}

.section-drag-ghost .section-block-toolbar-area {
  display: none !important;
}

/* Placeholder na posição original durante o arraste */
.section-block--source-dragging {
  opacity: 0.2;
  border-style: dashed !important;
  border-color: #94a3b8 !important;
  background: #f1f5f9 !important;
}

.section-block--source-dragging .section-block-toolbar-area {
  visibility: hidden;
}

/* Linha indicadora de onde a seção vai cair */
.section-drop-indicator {
  position: fixed;
  z-index: 9998;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, #0ea5e9, transparent);
  pointer-events: none;
  box-shadow: 0 0 8px rgba(14, 165, 233, 0.6);
}

body.section-drag-active {
  cursor: grabbing;
  user-select: none;
}

body.section-drag-active .ProseMirror {
  caret-color: transparent;
}
</style>
