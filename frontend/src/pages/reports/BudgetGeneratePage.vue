<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import Card from '@/components/utils/Card.vue'
import Input from '@/components/utils/Input.vue'
import Textarea from '@/components/utils/Textarea.vue'
import Select from '@/components/utils/Select.vue'
import Button from '@/components/utils/Button.vue'
import {
  WORK_TYPE_OPTIONS,
  CONSTRUCTION_STANDARD_OPTIONS,
  COMPLEXITY_OPTIONS,
  ADJUSTMENT_INDEX_OPTIONS,
  labelForValue,
} from '@/constants/budget'
import { flattenVariables } from '@/components/document-editor/constants/variables'
import { useSwal } from '@/utils/swal'
import { downloadDocumentPdf } from '@/utils/documentPdf'
import api from '@/services/api'

const swal = useSwal()

const loading = ref(true)
const generating = ref(false)
const templates = ref([])

const form = reactive({
  work_name: '',
  work_type: '',
  built_area: '',
  floors: '',
  construction_standard: '',
  location: '',
  city_state: '',
  deadline_months: '',
  deadline: '',
  base_date: new Date().toISOString().slice(0, 10),
  adjustment_index: 'INCC',
  adjustment_index_other: '',
  complexity: '',
  template_id: '',
})

const budgetTemplates = computed(() =>
  templates.value.filter((template) => template.document_type === 'ORCAMENTO')
)

const templateOptions = computed(() =>
  budgetTemplates.value.map((template) => ({
    value: String(template.id),
    label: template.name,
  }))
)

const selectedTemplate = computed(() =>
  budgetTemplates.value.find((template) => String(template.id) === form.template_id)
)

const formatVariableKey = (key) => `{{${key}}}`

const budgetVariablesPreview = computed(() => {
  const payload = buildBudgetPayload()
  return flattenVariables('ORCAMENTO').map((item) => ({
    label: item.label,
    key: item.key,
    value: resolvePreviewValue(item.key, payload),
  }))
})

function resolvePreviewValue(key, payload) {
  const map = {
    'budget.work_name': payload.work_name,
    'budget.work_type': labelForValue(WORK_TYPE_OPTIONS, payload.work_type),
    'budget.built_area': payload.built_area ? `${payload.built_area} m²` : '',
    'budget.floors': payload.floors,
    'budget.construction_standard': labelForValue(
      CONSTRUCTION_STANDARD_OPTIONS,
      payload.construction_standard
    ),
    'budget.location': payload.location,
    'budget.city_state': payload.city_state,
    'budget.deadline': payload.deadline || (payload.deadline_months ? `${payload.deadline_months} meses` : ''),
    'budget.deadline_months': payload.deadline_months,
    'budget.base_date': payload.base_date
      ? new Date(`${payload.base_date}T12:00:00`).toLocaleDateString('pt-BR')
      : '',
    'budget.adjustment_index':
      payload.adjustment_index === 'OUTRO'
        ? payload.adjustment_index_other
        : labelForValue(ADJUSTMENT_INDEX_OPTIONS, payload.adjustment_index),
    'budget.complexity': labelForValue(COMPLEXITY_OPTIONS, payload.complexity),
    'budget.generated_at': new Date().toLocaleDateString('pt-BR'),
  }

  return map[key] || '—'
}

const buildBudgetPayload = () => ({
  work_name: form.work_name.trim(),
  work_type: form.work_type,
  built_area: form.built_area ? Number(form.built_area) : undefined,
  floors: form.floors ? Number(form.floors) : undefined,
  construction_standard: form.construction_standard,
  location: form.location.trim(),
  city_state: form.city_state.trim(),
  deadline: form.deadline.trim() || undefined,
  deadline_months: form.deadline_months ? Number(form.deadline_months) : undefined,
  base_date: form.base_date || undefined,
  adjustment_index: form.adjustment_index,
  adjustment_index_other: form.adjustment_index_other.trim() || undefined,
  complexity: form.complexity,
})

const validateForm = () => {
  if (!form.work_name.trim()) {
    swal.error('Atenção', 'Informe o nome da obra.')
    return false
  }
  if (!form.work_type) {
    swal.error('Atenção', 'Selecione o tipo da obra.')
    return false
  }
  if (!form.built_area || Number(form.built_area) <= 0) {
    swal.error('Atenção', 'Informe a área construída (m²).')
    return false
  }
  if (!form.floors || Number(form.floors) <= 0) {
    swal.error('Atenção', 'Informe o número de pavimentos.')
    return false
  }
  if (!form.construction_standard) {
    swal.error('Atenção', 'Selecione o padrão construtivo.')
    return false
  }
  if (!form.location.trim()) {
    swal.error('Atenção', 'Informe a localização da obra.')
    return false
  }
  if (!form.city_state.trim()) {
    swal.error('Atenção', 'Informe cidade e estado.')
    return false
  }
  if (!form.deadline.trim() && !form.deadline_months) {
    swal.error('Atenção', 'Informe o prazo da obra em meses ou descrição.')
    return false
  }
  if (!form.base_date) {
    swal.error('Atenção', 'Informe a data-base do orçamento.')
    return false
  }
  if (!form.adjustment_index) {
    swal.error('Atenção', 'Selecione o índice de reajuste.')
    return false
  }
  if (form.adjustment_index === 'OUTRO' && !form.adjustment_index_other.trim()) {
    swal.error('Atenção', 'Descreva o índice de reajuste personalizado.')
    return false
  }
  if (!form.complexity) {
    swal.error('Atenção', 'Selecione a complexidade da obra.')
    return false
  }
  if (!form.template_id) {
    swal.error('Atenção', 'Selecione o template de orçamento.')
    return false
  }
  return true
}

const loadTemplates = async () => {
  try {
    const { data } = await api.get('/document-templates')
    if (data?.success) {
      templates.value = data.data
      const defaultTemplate = budgetTemplates.value[0]
      if (defaultTemplate) {
        form.template_id = String(defaultTemplate.id)
      }
    }
  } catch {
    swal.error('Erro', 'Não foi possível carregar os templates de orçamento.')
  } finally {
    loading.value = false
  }
}

onMounted(loadTemplates)

const handleGenerate = async () => {
  if (!validateForm()) return

  generating.value = true
  try {
    const template = selectedTemplate.value
    await downloadDocumentPdf({
      templateId: template.id,
      name: `Orcamento-${form.work_name.trim()}`,
      budgetData: buildBudgetPayload(),
    })
    swal.success('Orçamento gerado com sucesso!')
  } catch {
    swal.error('Erro', 'Não foi possível gerar o orçamento em PDF.')
  } finally {
    generating.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold tracking-tight text-marble-900">Gerar orçamento</h1>
      <p class="mt-1 text-sm text-marble-600">
        Preencha os parâmetros da obra. Estes dados alimentam todas as variáveis do documento de orçamento.
      </p>
    </div>

    <div v-if="loading" class="flex justify-center p-12 text-marble-500">Carregando...</div>

    <form v-else class="space-y-6" @submit.prevent="handleGenerate">
      <Card title="Template do documento">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <Select
              v-model="form.template_id"
              label="Template de orçamento"
              :options="templateOptions"
              placeholder="Selecione o template"
              required
            />
            <p v-if="!budgetTemplates.length" class="mt-2 text-sm text-amber-700">
              Nenhum template de orçamento encontrado. Crie um em Documentos com tipo
              <strong>Orçamento</strong>.
            </p>
          </div>
        </div>
      </Card>

      <Card title="Identificação da obra">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <Input v-model="form.work_name" label="Nome da obra" placeholder="Ex: Residência Alto da Boa Vista" required />
          </div>
          <Select
            v-model="form.work_type"
            label="Tipo da obra"
            :options="WORK_TYPE_OPTIONS"
            placeholder="Selecione o tipo"
            required
          />
          <Input
            v-model="form.location"
            label="Localização"
            placeholder="Ex: Rua das Acácias, 120 — Bairro Centro"
            required
          />
          <Input
            v-model="form.city_state"
            label="Cidade/Estado"
            placeholder="Ex: São Paulo/SP"
            required
          />
        </div>
      </Card>

      <Card title="Características técnicas">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input
            v-model="form.built_area"
            label="Área construída (m²)"
            type="number"
            min="0"
            step="0.01"
            placeholder="Ex: 285.50"
            required
          />
          <Input
            v-model="form.floors"
            label="Número de pavimentos"
            type="number"
            min="1"
            step="1"
            placeholder="Ex: 2"
            required
          />
          <Select
            v-model="form.construction_standard"
            label="Padrão construtivo"
            :options="CONSTRUCTION_STANDARD_OPTIONS"
            placeholder="Selecione o padrão"
            required
          />
          <Select
            v-model="form.complexity"
            label="Complexidade da obra"
            :options="COMPLEXITY_OPTIONS"
            placeholder="Selecione a complexidade"
            required
          />
        </div>
      </Card>

      <Card title="Parâmetros do orçamento">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input
            v-model="form.deadline_months"
            label="Prazo da obra (meses)"
            type="number"
            min="1"
            step="1"
            placeholder="Ex: 8"
            helper-text="Informe em meses ou descreva no campo ao lado."
          />
          <Input
            v-model="form.deadline"
            label="Prazo da obra (descrição)"
            placeholder="Ex: 8 meses após liberação da ART"
          />
          <Input v-model="form.base_date" label="Data-base do orçamento" type="date" required />
          <Select
            v-model="form.adjustment_index"
            label="Índice de reajuste"
            :options="ADJUSTMENT_INDEX_OPTIONS"
            placeholder="Selecione o índice"
            required
          />
          <div v-if="form.adjustment_index === 'OUTRO'" class="sm:col-span-2">
            <Input
              v-model="form.adjustment_index_other"
              label="Descrição do índice de reajuste"
              placeholder="Ex: Índice contratual XYZ"
              required
            />
          </div>
        </div>
      </Card>

      <Card title="Variáveis que serão enviadas ao documento">
        <p class="mb-4 text-sm text-marble-600">
          Pré-visualização dos valores que substituirão as variáveis no template selecionado.
        </p>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div
            v-for="item in budgetVariablesPreview"
            :key="item.key"
            class="rounded-lg border border-marble-200 bg-marble-50 px-3 py-2"
          >
            <p class="text-xs font-medium uppercase tracking-wide text-marble-500">{{ item.label }}</p>
            <p class="mt-1 text-sm text-marble-900">{{ item.value || '—' }}</p>
            <p class="mt-1 font-mono text-[11px] text-sky-700">{{ formatVariableKey(item.key) }}</p>
          </div>
        </div>
      </Card>

      <div class="flex justify-end gap-3 border-t border-marble-200 pt-4">
        <Button type="submit" variant="primary" :loading="generating" :disabled="!budgetTemplates.length">
          Gerar orçamento em PDF
        </Button>
      </div>
    </form>
  </div>
</template>
