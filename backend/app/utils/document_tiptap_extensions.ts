import { Node, mergeAttributes } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import HorizontalRule from '@tiptap/extension-horizontal-rule'

const DocumentWithSections = Document.extend({
  content: '(sectionBlock | horizontalRule)+',
})

export const SectionBlock = Node.create({
  name: 'sectionBlock',
  group: 'block',
  content: 'block+',

  parseHTML() {
    return [{ tag: 'section[data-section-block]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'section',
      mergeAttributes(HTMLAttributes, {
        'data-section-block': '',
        class: 'section-block',
      }),
      0,
    ]
  },
})

export const TemplateVariable = Node.create({
  name: 'templateVariable',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      key: { default: '' },
      label: { default: '' },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-template-variable]' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    const key = node.attrs.key as string
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-template-variable': '',
        class: 'template-variable',
      }),
      `{{${key}}}`,
    ]
  },
})

export function createDocumentPdfExtensions() {
  return [
    StarterKit.configure({
      document: false,
      horizontalRule: false,
    }),
    DocumentWithSections,
    Underline,
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    HorizontalRule,
    SectionBlock,
    TemplateVariable,
  ]
}
