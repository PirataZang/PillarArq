import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import SectionBlockView from '../node-views/SectionBlockView.vue'
import {
  createSectionStructurePlugin,
  handleSectionEnter,
} from '../utils/sectionContent'

export const SectionBlock = Node.create({
  name: 'sectionBlock',
  group: 'block',
  content: 'block+',
  defining: true,
  draggable: false,
  selectable: true,

  parseHTML() {
    return [{ tag: 'section[data-section-block]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['section', mergeAttributes(HTMLAttributes, { 'data-section-block': '' }), 0]
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => handleSectionEnter(editor),
      'Mod-Enter': ({ editor }) => handleSectionEnter(editor),
    }
  },

  addProseMirrorPlugins() {
    return [createSectionStructurePlugin()]
  },

  addNodeView() {
    return VueNodeViewRenderer(SectionBlockView, {
      stopEvent: ({ event }) => {
        const target = event.target
        if (!(target instanceof Element)) return undefined
        if (target.closest('[data-section-drag-handle]')) return false
        if (target.closest('.section-block-toolbar-area')) return true
        return undefined
      },
    })
  },

  addCommands() {
    return {
      insertSectionBlock:
        () =>
        ({ chain, state }) => {
          const insertPos = state.doc.content.size
          return chain()
            .insertContentAt(insertPos, {
              type: this.name,
              content: [{ type: 'paragraph' }],
            })
            .focus(insertPos + 2)
            .run()
        },
    }
  },
})
