<script setup>
import { ref, computed } from 'vue'
import { TEMPLATE_VARIABLES } from './constants/variables'

const props = defineProps({
  editor: { type: Object, default: null },
})

const emit = defineEmits(['insert-block'])

const activeTab = ref('variables')
const search = ref('')
const openGroups = ref(TEMPLATE_VARIABLES.map((g) => g.id))

const filteredGroups = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return TEMPLATE_VARIABLES

  return TEMPLATE_VARIABLES.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) =>
        item.label.toLowerCase().includes(term) || item.key.toLowerCase().includes(term)
    ),
  })).filter((group) => group.items.length > 0)
})

const toggleGroup = (groupId) => {
  if (openGroups.value.includes(groupId)) {
    openGroups.value = openGroups.value.filter((id) => id !== groupId)
  } else {
    openGroups.value.push(groupId)
  }
}

const insertVariable = (item) => {
  props.editor?.chain().focus().insertTemplateVariable({ key: item.key, label: item.label }).run()
}

const formatVariable = (key) => `{{${key}}}`

const blocks = [
  {
    id: 'paragraph',
    label: 'Parágrafo',
    icon: 'fa-paragraph',
    action: () => props.editor?.chain().focus().insertSectionBlock([{ type: 'paragraph' }]).run(),
  },
  {
    id: 'h1',
    label: 'Título H1',
    icon: 'fa-heading',
    action: () =>
      props.editor
        ?.chain()
        .focus()
        .insertSectionBlock([
          { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Novo título' }] },
        ])
        .run(),
  },
  {
    id: 'h2',
    label: 'Título H2',
    icon: 'fa-heading',
    action: () =>
      props.editor
        ?.chain()
        .focus()
        .insertSectionBlock([
          { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Subtítulo' }] },
        ])
        .run(),
  },
  {
    id: 'separator',
    label: 'Separador',
    icon: 'fa-minus',
    action: () => props.editor?.chain().focus().setHorizontalRule().run(),
  },
]
</script>

<template>
  <aside class="flex h-full w-72 shrink-0 flex-col border-r border-marble-200 bg-white">
    <div class="flex border-b border-marble-200">
      <button
        type="button"
        class="flex-1 px-4 py-3 text-sm font-medium transition-colors"
        :class="activeTab === 'variables' ? 'border-b-2 border-sky-500 text-sky-700' : 'text-marble-500 hover:text-marble-700'"
        @click="activeTab = 'variables'"
      >
        Variáveis
      </button>
      <button
        type="button"
        class="flex-1 px-4 py-3 text-sm font-medium transition-colors"
        :class="activeTab === 'blocks' ? 'border-b-2 border-sky-500 text-sky-700' : 'text-marble-500 hover:text-marble-700'"
        @click="activeTab = 'blocks'"
      >
        Blocos
      </button>
    </div>

    <div v-if="activeTab === 'variables'" class="flex flex-1 flex-col overflow-hidden">
      <div class="p-3">
        <input
          v-model="search"
          type="search"
          placeholder="Buscar variável..."
          class="w-full rounded-lg border border-marble-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
        />
      </div>

      <div class="flex-1 overflow-y-auto px-3 pb-4">
        <div v-for="group in filteredGroups" :key="group.id" class="mb-3">
          <button
            type="button"
            class="mb-1 flex w-full items-center justify-between text-left text-xs font-semibold uppercase tracking-wide text-marble-500"
            @click="toggleGroup(group.id)"
          >
            {{ group.label }}
            <i
              class="fa-solid text-[10px]"
              :class="openGroups.includes(group.id) ? 'fa-chevron-up' : 'fa-chevron-down'"
            />
          </button>

          <div v-show="openGroups.includes(group.id)" class="space-y-1">
            <button
              v-for="item in group.items"
              :key="item.key"
              type="button"
              class="flex w-full flex-col rounded-lg border border-transparent px-2 py-2 text-left hover:border-sky-200 hover:bg-sky-50"
              @click="insertVariable(item)"
            >
              <span class="text-sm text-marble-800">{{ item.label }}</span>
              <span class="font-mono text-xs text-sky-600">{{ formatVariable(item.key) }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex-1 overflow-y-auto p-3">
      <p class="mb-3 text-xs text-marble-500">Clique para adicionar ao documento:</p>
      <div class="space-y-2">
        <button
          v-for="block in blocks"
          :key="block.id"
          type="button"
          class="flex w-full items-center gap-3 rounded-lg border border-marble-200 px-3 py-3 text-left text-sm text-marble-800 hover:border-sky-300 hover:bg-sky-50"
          @click="block.action()"
        >
          <i class="fa-solid w-4 text-center text-marble-500" :class="block.icon" />
          {{ block.label }}
        </button>
      </div>
    </div>
  </aside>
</template>
