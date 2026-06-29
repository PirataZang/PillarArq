import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import TemplateVariableView from '../node-views/TemplateVariableView.vue'

export const TemplateVariable = Node.create({
  name: 'templateVariable',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      key: { default: '' },
      label: { default: '' },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-template-variable]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-template-variable': '' }), `{{${HTMLAttributes.key}}}`]
  },

  addNodeView() {
    return VueNodeViewRenderer(TemplateVariableView)
  },

  addCommands() {
    return {
      insertTemplateVariable:
        (attrs) =>
        ({ chain }) =>
          chain().insertContent({ type: this.name, attrs }).run(),
    }
  },
})
