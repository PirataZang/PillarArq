<script setup>
import { ref, computed, watch } from 'vue'
import Modal from '@/components/utils/Modal.vue'
import Button from '@/components/utils/Button.vue'
import api from '@/services/api'
import {
  fieldLabel,
  formatAuditValue,
  formatAuditDate,
  EVENT_LABELS,
  EVENT_FILTERS,
} from '@/utils/auditFieldLabels'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  subjectType: { type: String, required: true },
  subjectId: { type: [String, Number], required: true },
})

const emit = defineEmits(['update:modelValue'])

const loading = ref(false)
const logs = ref([])
const loadError = ref('')
const search = ref('')
const eventFilter = ref('all')
const expandedJson = ref({})

const close = () => emit('update:modelValue', false)

const loadLogs = async () => {
  if (!props.subjectId) return
  loading.value = true
  loadError.value = ''
  try {
    const { data } = await api.get(`/activity-logs/${props.subjectType}/${props.subjectId}`)
    logs.value = data?.success ? data.data : []
  } catch (err) {
    logs.value = []
    loadError.value = err.response?.data?.message || 'Não foi possível carregar o histórico.'
  } finally {
    loading.value = false
  }
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      search.value = ''
      eventFilter.value = 'all'
      expandedJson.value = {}
      loadLogs()
    }
  }
)

const getChangeKeys = (log) => {
  const keys = new Set([
    ...Object.keys(log.old_values ?? {}),
    ...Object.keys(log.new_values ?? {}),
  ])
  return [...keys]
}

const filteredLogs = computed(() => {
  const term = search.value.trim().toLowerCase()
  return logs.value.filter((log) => {
    if (eventFilter.value !== 'all' && log.event !== eventFilter.value) return false
    if (!term) return true

    const userName = (log.user?.name ?? '').toLowerCase()
    if (userName.includes(term)) return true

    const keys = getChangeKeys(log)
    return keys.some((key) => {
      const label = fieldLabel(key).toLowerCase()
      const oldVal = formatAuditValue(log.old_values?.[key]).toLowerCase()
      const newVal = formatAuditValue(log.new_values?.[key]).toLowerCase()
      return label.includes(term) || oldVal.includes(term) || newVal.includes(term)
    })
  })
})

const toggleJson = (id) => {
  expandedJson.value[id] = !expandedJson.value[id]
}

const userInitial = (log) => (log.user?.name?.[0] ?? '?').toUpperCase()

const changeCount = (log) => {
  if (log.event === 'created') return Object.keys(log.new_values ?? {}).length
  if (log.event === 'deleted') return Object.keys(log.old_values ?? {}).length
  return getChangeKeys(log).length
}

const jsonPayload = (log) =>
  JSON.stringify(
    {
      attributes: log.new_values ?? {},
      old: log.old_values ?? {},
    },
    null,
    2
  )
</script>

<template>
  <Modal
    :model-value="modelValue"
    title="Histórico de Alterações"
    :width="920"
    @update:model-value="emit('update:modelValue', $event)"
    @close="close"
  >
    <div class="space-y-4">
      <input
        v-model="search"
        type="search"
        placeholder="Buscar por usuário, campo alterado ou valor..."
        class="w-full rounded-lg border border-marble-200 px-4 py-2.5 text-sm text-marble-900 placeholder:text-marble-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
      />

      <div class="flex flex-wrap gap-2">
        <button
          v-for="filter in EVENT_FILTERS"
          :key="filter.value"
          type="button"
          class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
          :class="
            eventFilter === filter.value
              ? 'bg-sky-600 text-white'
              : 'border border-marble-200 bg-white text-marble-700 hover:bg-marble-50'
          "
          @click="eventFilter = filter.value"
        >
          <span v-if="filter.value === 'created'">+ </span>
          <span v-if="filter.value === 'updated'"><i class="fa-solid fa-pen text-xs"></i> </span>
          <span v-if="filter.value === 'deleted'"><i class="fa-solid fa-trash text-xs"></i> </span>
          {{ filter.label }}
        </button>
      </div>

      <div v-if="loading" class="py-12 text-center text-marble-500">Carregando histórico...</div>

      <div v-else-if="loadError" class="py-12 text-center text-red-600">{{ loadError }}</div>

      <div v-else-if="filteredLogs.length === 0" class="py-12 text-center text-marble-500">
        Nenhuma alteração encontrada.
      </div>

      <div v-else class="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        <article
          v-for="log in filteredLogs"
          :key="log.id"
          class="rounded-xl border border-marble-200 bg-white p-4 shadow-sm"
        >
          <div class="flex items-start gap-3">
            <div
              class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white"
            >
              {{ userInitial(log) }}
              <span
                class="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] text-sky-600 shadow"
              >
                <i class="fa-solid fa-pen"></i>
              </span>
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-semibold text-marble-900">{{ log.user?.name ?? 'Sistema' }}</span>
                <span class="text-sm text-marble-600">{{ EVENT_LABELS[log.event] }}</span>
                <span
                  v-if="changeCount(log) > 0"
                  class="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700"
                >
                  {{ changeCount(log) }} {{ changeCount(log) === 1 ? 'alteração' : 'alterações' }}
                </span>
              </div>
              <p class="mt-1 text-xs text-marble-500">
                {{ formatAuditDate(log.update_date) }}
                <span v-if="log.ip_address"> · IP: {{ log.ip_address }}</span>
              </p>
            </div>
          </div>

          <div class="mt-4 space-y-3">
            <div v-for="key in getChangeKeys(log)" :key="key" class="space-y-1.5">
              <p class="text-xs font-bold uppercase tracking-wide text-marble-700">
                {{ fieldLabel(key) }}
              </p>
              <div class="grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <div class="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-900">
                  <span class="mb-1 block text-[10px] font-semibold uppercase text-red-500">Antes</span>
                  {{ formatAuditValue(log.old_values?.[key]) }}
                </div>
                <div class="hidden text-center text-marble-400 sm:block">→</div>
                <div class="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
                  <span class="mb-1 block text-[10px] font-semibold uppercase text-emerald-600">Depois</span>
                  {{ formatAuditValue(log.new_values?.[key]) }}
                </div>
              </div>
            </div>

            <div
              v-if="log.event === 'created' && getChangeKeys(log).length === 0 && log.new_values"
              class="text-sm text-marble-600"
            >
              Registro criado com {{ Object.keys(log.new_values).length }} campo(s).
            </div>
          </div>

          <div class="mt-4 border-t border-marble-100 pt-3">
            <button
              type="button"
              class="text-sm font-medium text-sky-700 hover:text-sky-900"
              @click="toggleJson(log.id)"
            >
              <i class="fa-solid fa-code mr-1"></i>
              {{ expandedJson[log.id] ? 'Ocultar JSON' : 'Ver Detalhes JSON' }}
              <i :class="expandedJson[log.id] ? 'fa-chevron-up' : 'fa-chevron-down'" class="fa-solid ml-1 text-xs"></i>
            </button>
            <div v-if="expandedJson[log.id]" class="mt-3">
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-marble-500">
                Payload bruto (atributos modificados)
              </p>
              <pre
                class="overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs leading-relaxed text-emerald-300"
              >{{ jsonPayload(log) }}</pre>
            </div>
          </div>
        </article>
      </div>
    </div>

    <template #actions>
      <Button type="button" variant="danger" @click="close">
        <i class="fa-solid fa-xmark mr-2"></i>
        Fechar
      </Button>
    </template>
  </Modal>
</template>
