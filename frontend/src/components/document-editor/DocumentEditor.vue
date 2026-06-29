<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { DragHandle } from '@tiptap/extension-drag-handle-vue-3'
import DocumentEditorSidebar from './DocumentEditorSidebar.vue'
import { createDocumentExtensions, DEFAULT_DOCUMENT_CONTENT } from './extensions'
import {
  A4_WIDTH_PX,
  A4_HEIGHT_PX,
  PAGE_PADDING_PX,
  PAGE_CONTENT_HEIGHT,
  PAGE_GAP_PX,
} from './constants/a4'

const props = defineProps({
  modelValue: { type: Object, default: null },
  title: { type: String, default: 'Novo Template' },
})

const emit = defineEmits(['update:modelValue', 'save', 'preview'])

const saveStatus = ref('Salvo')
const pageCount = ref(1)
const contentRef = ref(null)
let resizeObserver = null

const editor = useEditor({
  content: props.modelValue ?? DEFAULT_DOCUMENT_CONTENT,
  extensions: createDocumentExtensions(),
  editorProps: {
    attributes: {
      class: 'document-prosemirror outline-none min-h-full',
    },
  },
  onUpdate: ({ editor: ed }) => {
    saveStatus.value = 'Alterado'
    emit('update:modelValue', ed.getJSON())
    schedulePageMeasure()
  },
})

const updatePageCount = () => {
  const prose = contentRef.value?.querySelector('.ProseMirror')
  if (!prose) {
    pageCount.value = 1
    return
  }
  const height = prose.scrollHeight
  pageCount.value = Math.max(1, Math.ceil(height / PAGE_CONTENT_HEIGHT))
}

const schedulePageMeasure = () => {
  nextTick(() => updatePageCount())
}

watch(
  () => props.modelValue,
  (value) => {
    if (!editor.value || !value) return
    const current = JSON.stringify(editor.value.getJSON())
    const incoming = JSON.stringify(value)
    if (current !== incoming) {
      editor.value.commands.setContent(value, false)
      schedulePageMeasure()
    }
  }
)

onMounted(() => {
  schedulePageMeasure()
  const prose = () => contentRef.value?.querySelector('.ProseMirror')
  resizeObserver = new ResizeObserver(() => updatePageCount())
  const node = prose()
  if (node) resizeObserver.observe(node)
})

onBeforeUnmount(() => {
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
          class="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
          @click="handleSave"
        >
          Salvar Template
        </button>
      </div>
    </header>

    <div class="flex min-h-0 flex-1">
      <DocumentEditorSidebar :editor="editor" />

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
                <DragHandle v-if="editor" :editor="editor">
                  <div class="hidden" />
                </DragHandle>
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

.document-prosemirror .ProseMirror-selectednode {
  outline: none;
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
</style>
