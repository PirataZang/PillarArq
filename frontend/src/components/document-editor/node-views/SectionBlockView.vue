<script setup>
import { computed } from 'vue'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'
import DocumentBlockToolbar from '../DocumentBlockToolbar.vue'

const props = defineProps({
  editor: { type: Object, required: true },
  node: { type: Object, required: true },
  selected: { type: Boolean, default: false },
  deleteNode: { type: Function, default: null },
  getPos: { type: Function, default: null },
})

const showToolbar = computed(() => props.selected || props.editor.isFocused)
</script>

<template>
  <NodeViewWrapper
    class="section-block group relative my-4 rounded-lg border border-sky-200 bg-sky-50/60 transition-shadow"
    :class="{ 'ring-2 ring-sky-400 shadow-sm': selected }"
    data-section-block
  >
    <div
      v-if="showToolbar"
      class="absolute -top-11 left-0 right-0 z-20 flex items-center justify-between gap-2"
    >
      <div
        class="drag-handle flex h-8 w-8 cursor-grab items-center justify-center rounded-md border border-marble-200 bg-white text-marble-500 shadow-sm active:cursor-grabbing"
        contenteditable="false"
        data-drag-handle
        title="Arrastar bloco"
      >
        <i class="fa-solid fa-grip text-sm" />
      </div>

      <DocumentBlockToolbar :editor="editor" class="flex-1" />

      <button
        type="button"
        class="flex h-8 w-8 items-center justify-center rounded-md border border-red-200 bg-white text-red-500 shadow-sm hover:bg-red-50"
        contenteditable="false"
        title="Remover bloco"
        @click="deleteNode?.()"
      >
        <i class="fa-solid fa-trash text-sm" />
      </button>
    </div>

    <div class="section-block-content px-5 py-4">
      <NodeViewContent />
    </div>
  </NodeViewWrapper>
</template>
