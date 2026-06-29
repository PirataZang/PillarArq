import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import DragHandle from '@tiptap/extension-drag-handle'
import { SectionBlock } from './sectionBlock'
import { TemplateVariable } from './templateVariable'

export function createDocumentExtensions() {
  return [
    StarterKit.configure({
      horizontalRule: false,
    }),
    Underline,
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    HorizontalRule,
    Placeholder.configure({
      placeholder: 'Comece a escrever o documento...',
    }),
    DragHandle.configure({
      dragHandleWidth: 24,
    }),
    SectionBlock,
    TemplateVariable,
  ]
}

export const DEFAULT_DOCUMENT_CONTENT = {
  type: 'doc',
  content: [
    {
      type: 'sectionBlock',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Template Customizável de Documentos' }],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Customize qualquer tipo de documento com blocos, formatação e variáveis dinâmicas.' },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'paragraph',
          attrs: { textAlign: 'left' },
          content: [{ type: 'text', text: 'Esquerda' }],
        },
        {
          type: 'paragraph',
          attrs: { textAlign: 'center' },
          content: [{ type: 'text', text: 'Meio' }],
        },
        {
          type: 'paragraph',
          attrs: { textAlign: 'right' },
          content: [{ type: 'text', text: 'Direita' }],
        },
        {
          type: 'paragraph',
          attrs: { textAlign: 'justify' },
          content: [{ type: 'text', text: 'Justificado — texto de exemplo para demonstrar o alinhamento completo na página.' }],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Variáveis para usar:' }],
    },
  ],
}
