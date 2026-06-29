import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import { SectionBlock } from './sectionBlock'
import { TemplateVariable } from './templateVariable'
import { EMPTY_DOCUMENT_CONTENT } from '../utils/documentContent'

const DocumentWithSections = Document.extend({
  content: '(sectionBlock | horizontalRule)+',
})

export function createDocumentExtensions() {
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
    Placeholder.configure({
      placeholder: 'Clique para escrever...',
      showOnlyWhenEditable: true,
      includeChildren: true,
    }),
    SectionBlock,
    TemplateVariable,
  ]
}

export const DEFAULT_DOCUMENT_CONTENT = EMPTY_DOCUMENT_CONTENT
