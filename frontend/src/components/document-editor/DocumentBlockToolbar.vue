<script setup>
import { ref } from 'vue'
import { runOnSelection, setAlignOnSelection, isAlignActive } from './utils/toolbarActions'

const props = defineProps({
  editor: { type: Object, required: true },
})

const textColor = ref('#dc2626')
const highlightColor = ref('#fecaca')

const run = (fn) => runOnSelection(props.editor, fn)

const setTextColor = () => run((chain) => chain.setColor(textColor.value).run())
const setHighlight = () => run((chain) => chain.setHighlight({ color: highlightColor.value }).run())
const setAlign = (align) => setAlignOnSelection(props.editor, align)
</script>

<template>
  <div class="flex flex-wrap items-center gap-0.5" contenteditable="false">
    <button
      type="button"
      class="toolbar-btn"
      :class="{ 'is-active': editor.isActive('bold') }"
      title="Negrito"
      @mousedown.prevent
      @click="run((c) => c.toggleBold().run())"
    >
      <strong>N</strong>
    </button>
    <button
      type="button"
      class="toolbar-btn"
      :class="{ 'is-active': editor.isActive('italic') }"
      title="Itálico"
      @mousedown.prevent
      @click="run((c) => c.toggleItalic().run())"
    >
      <em>I</em>
    </button>
    <button
      type="button"
      class="toolbar-btn"
      :class="{ 'is-active': editor.isActive('strike') }"
      title="Tachado"
      @mousedown.prevent
      @click="run((c) => c.toggleStrike().run())"
    >
      <s>S</s>
    </button>
    <button
      type="button"
      class="toolbar-btn"
      :class="{ 'is-active': editor.isActive('code') }"
      title="Código"
      @mousedown.prevent
      @click="run((c) => c.toggleCode().run())"
    >
      R
    </button>

    <span class="mx-1 h-5 w-px bg-marble-200" />

    <label class="toolbar-btn relative cursor-pointer" title="Cor do texto">
      <span class="font-semibold text-marble-700">A</span>
      <input
        v-model="textColor"
        type="color"
        class="absolute inset-0 cursor-pointer opacity-0"
        @mousedown.prevent
        @input="setTextColor"
      />
    </label>
    <label class="toolbar-btn relative cursor-pointer" title="Marca-texto">
      <span class="rounded bg-yellow-200 px-0.5 text-xs font-semibold">H</span>
      <input
        v-model="highlightColor"
        type="color"
        class="absolute inset-0 cursor-pointer opacity-0"
        @mousedown.prevent
        @input="setHighlight"
      />
    </label>

    <span class="mx-1 h-5 w-px bg-marble-200" />

    <button
      type="button"
      class="toolbar-btn"
      :class="{ 'is-active': isAlignActive(editor, 'left') }"
      title="Alinhar à esquerda"
      @mousedown.prevent
      @click="setAlign('left')"
    >
      <i class="fa-solid fa-align-left text-xs" />
    </button>
    <button
      type="button"
      class="toolbar-btn"
      :class="{ 'is-active': isAlignActive(editor, 'center') }"
      title="Centralizar"
      @mousedown.prevent
      @click="setAlign('center')"
    >
      <i class="fa-solid fa-align-center text-xs" />
    </button>
    <button
      type="button"
      class="toolbar-btn"
      :class="{ 'is-active': isAlignActive(editor, 'right') }"
      title="Alinhar à direita"
      @mousedown.prevent
      @click="setAlign('right')"
    >
      <i class="fa-solid fa-align-right text-xs" />
    </button>
    <button
      type="button"
      class="toolbar-btn"
      :class="{ 'is-active': isAlignActive(editor, 'justify') }"
      title="Justificar"
      @mousedown.prevent
      @click="setAlign('justify')"
    >
      <i class="fa-solid fa-align-justify text-xs" />
    </button>

    <span class="mx-1 h-5 w-px bg-marble-200" />

    <button
      type="button"
      class="toolbar-btn"
      :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
      title="Título H1"
      @mousedown.prevent
      @click="run((c) => c.toggleHeading({ level: 1 }).run())"
    >
      H1
    </button>
    <button
      type="button"
      class="toolbar-btn"
      :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
      title="Título H2"
      @mousedown.prevent
      @click="run((c) => c.toggleHeading({ level: 2 }).run())"
    >
      H2
    </button>
    <button
      type="button"
      class="toolbar-btn"
      :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
      title="Título H3"
      @mousedown.prevent
      @click="run((c) => c.toggleHeading({ level: 3 }).run())"
    >
      H3
    </button>

    <span class="mx-1 h-5 w-px bg-marble-200" />

    <button
      type="button"
      class="toolbar-btn"
      :class="{ 'is-active': editor.isActive('bulletList') }"
      title="Lista"
      @mousedown.prevent
      @click="run((c) => c.toggleBulletList().run())"
    >
      <i class="fa-solid fa-list-ul text-xs" />
    </button>
    <button
      type="button"
      class="toolbar-btn"
      :class="{ 'is-active': editor.isActive('orderedList') }"
      title="Lista numerada"
      @mousedown.prevent
      @click="run((c) => c.toggleOrderedList().run())"
    >
      <i class="fa-solid fa-list-ol text-xs" />
    </button>
    <button
      type="button"
      class="toolbar-btn"
      :class="{ 'is-active': editor.isActive('blockquote') }"
      title="Citação"
      @mousedown.prevent
      @click="run((c) => c.toggleBlockquote().run())"
    >
      <i class="fa-solid fa-quote-left text-xs" />
    </button>
  </div>
</template>

<style scoped>
.toolbar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.75rem;
  height: 1.75rem;
  padding: 0 0.35rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  color: var(--color-marble-700);
  transition: background-color 0.15s;
}

.toolbar-btn:hover {
  background-color: var(--color-marble-100);
}

.toolbar-btn.is-active {
  background-color: var(--color-marble-200);
  color: var(--color-marble-900);
}
</style>
