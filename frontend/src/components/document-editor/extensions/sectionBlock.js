import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import SectionBlockView from '../node-views/SectionBlockView.vue'

export const SectionBlock = Node.create({
  name: 'sectionBlock',
  group: 'block',
  content: 'block+',
  defining: true,
  isolating: true,
  draggable: true,

  parseHTML() {
    return [{ tag: 'section[data-section-block]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['section', mergeAttributes(HTMLAttributes, { 'data-section-block': '' }), 0]
  },

  addNodeView() {
    return VueNodeViewRenderer(SectionBlockView)
  },

  addCommands() {
    return {
      insertSectionBlock:
        (content) =>
        ({ chain }) =>
          chain()
            .insertContent({
              type: this.name,
              content: content ?? [{ type: 'paragraph' }],
            })
            .run(),
    }
  },
})
