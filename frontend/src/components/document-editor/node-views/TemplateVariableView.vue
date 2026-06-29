<script setup>
import { NodeViewWrapper } from '@tiptap/vue-3'

const props = defineProps({
  node: { type: Object, required: true },
  selected: { type: Boolean, default: false },
  deleteNode: { type: Function, default: null },
})

const braceOpen = '{{'
const braceClose = '}}'
</script>

<template>
  <NodeViewWrapper as="span" class="template-variable inline-block align-baseline">
    <span
      class="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-sky-50 px-1.5 py-0.5 text-xs font-mono text-sky-800"
      :class="{ 'ring-2 ring-sky-400': selected }"
      contenteditable="false"
    >
      <span class="text-sky-500">{{ braceOpen }}</span>
      <span>{{ node.attrs.key }}</span>
      <span class="text-sky-500">{{ braceClose }}</span>
    </span>
  </NodeViewWrapper>
</template>
