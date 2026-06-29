<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import Card from '@/components/utils/Card.vue'
import Input from '@/components/utils/Input.vue'
import Select from '@/components/utils/Select.vue'
import Button from '@/components/utils/Button.vue'
import BudgetMaterialsPanel from '@/components/reports/BudgetMaterialsPanel.vue'
import {
  WORK_TYPE_OPTIONS,
  CONSTRUCTION_STANDARD_OPTIONS,
  COMPLEXITY_OPTIONS,
  ADJUSTMENT_INDEX_OPTIONS,
  labelForValue,
} from '@/constants/budget'
import { formatCurrency } from '@/utils/currency'
import { useSwal } from '@/utils/swal'
import { downloadDocumentPdf } from '@/utils/documentPdf'
import api from '@/services/api'

const swal = useSwal()

const loading = ref(true)
const generating = ref(false)
const templates = ref([])
const materials = ref([])
const currentStep = ref(0)

const steps = [
  { id: 'work', label: 'Dados da obra', icon: 'fa-building' },
  { id: 'materials', label: 'Materiais', icon: 'fa-boxes-stacked' },
  { id: 'review', label: 'Revisão', icon: 'fa-file-circle-check' },
]

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

const materialsTableVariable = '{{budget.materials_table}}'

const materialsTotal = computed(() =>
  materials.value.reduce((total, item) => {
    return total + (Number(item.quantity) || 0) * (Number(item.unit_price) || 0)
  }, 0)
)

const completionPercent = computed(() => {
  let filled = 0
  const checks = [
    form.template_id,
    form.work_name.trim(),
    form.work_type,
    form.built_area,
    form.floors,
    form.construction_standard,
    form.location.trim(),
    form.city_state.trim(),
    form.base_date,
    form.adjustment_index,
    form.complexity,
    form.deadline.trim() || form.deadline_months,
  ]
  checks.forEach((value) => {
    if (value) filled += 1
  })
  return Math.round((filled / checks.length) * 100)
})

const summaryItems = computed(() => [
  { label: 'Obra', value: form.work_name || '—' },
  { label: 'Tipo', value: labelForValue(WORK_TYPE_OPTIONS, form.work_type) || '—' },
  { label: 'Área', value: form.built_area ? `${form.built_area} m²` : '—' },
  { label: 'Pavimentos', value: form.floors || '—' },
  { label: 'Local', value: form.city_state || form.location || '—' },
  { label: 'Materiais', value: `${materials.value.length} itens · ${formatCurrency(materialsTotal.value)}` },
])

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
  materials: materials.value.map(({ name, quantity, unit, unit_price, supplier }) => ({
    name,
    quantity,
    unit,
    unit_price,
    supplier: supplier || undefined,
  })),
})

const validateWorkStep = () => {
  if (!form.template_id) {
    swal.error('Atenção', 'Selecione o template de orçamento.')
    return false
  }
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
  return true
}

const goToStep = (index) => {
  if (index > currentStep.value && currentStep.value === 0 && !validateWorkStep()) return
  currentStep.value = index
}

const nextStep = () => {
  if (currentStep.value === 0 && !validateWorkStep()) return
  if (currentStep.value < steps.length - 1) currentStep.value += 1
}

const prevStep = () => {
  if (currentStep.value > 0) currentStep.value -= 1
}

const loadTemplates = async () => {
  try {
    const { data } = await api.get('/document-templates')
    if (data?.success) {
      templates.value = data.data
      const defaultTemplate = budgetTemplates.value[0]
      if (defaultTemplate) form.template_id = String(defaultTemplate.id)
    }
  } catch {
    swal.error('Erro', 'Não foi possível carregar os templates de orçamento.')
  } finally {
    loading.value = false
  }
}

onMounted(loadTemplates)

const handleGenerate = async () => {
  if (!validateWorkStep()) {
    currentStep.value = 0
    return
  }

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
  <div class="mx-auto max-w-6xl">
    <div class="mb-8">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-sky-600">Relatórios</p>
          <h1 class="mt-1 text-2xl font-bold tracking-tight text-marble-900">Gerar orçamento</h1>
          <p class="mt-2 max-w-2xl text-sm text-marble-600">
            Monte o orçamento em etapas: defina a obra, inclua os materiais e gere o PDF para o cliente.
          </p>
        </div>
        <div class="rounded-xl border border-marble-200 bg-white px-4 py-3 shadow-sm">
          <p class="text-xs font-medium text-marble-500">Preenchimento</p>
          <div class="mt-2 flex items-center gap-3">
            <div class="h-2 w-32 overflow-hidden rounded-full bg-marble-100">
              <div
                class="h-full rounded-full bg-sky-500 transition-all duration-300"
                :style="{ width: `${completionPercent}%` }"
              />
            </div>
            <span class="text-sm font-semibold text-marble-800">{{ completionPercent }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center rounded-xl border border-marble-200 bg-white p-16 text-marble-500">
      Carregando...
    </div>

    <div v-else class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div class="min-w-0">
        <div class="mb-6 rounded-xl border border-marble-200 bg-white p-2 shadow-sm">
          <div class="grid grid-cols-3 gap-1">
            <button
              v-for="(step, index) in steps"
              :key="step.id"
              type="button"
              class="flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-medium transition-colors"
              :class="
                currentStep === index
                  ? 'bg-sky-600 text-white shadow-sm'
                  : currentStep > index
                    ? 'bg-sky-50 text-sky-800 hover:bg-sky-100'
                    : 'text-marble-500 hover:bg-marble-50 hover:text-marble-800'
              "
              @click="goToStep(index)"
            >
              <span
                class="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
                :class="currentStep === index ? 'bg-white/20' : 'bg-marble-100'"
              >
                <i v-if="currentStep > index" class="fa-solid fa-check text-[10px]"></i>
                <span v-else>{{ index + 1 }}</span>
              </span>
              <span class="hidden sm:inline">{{ step.label }}</span>
            </button>
          </div>
        </div>

        <form class="space-y-6" @submit.prevent="handleGenerate">
          <div v-show="currentStep === 0" class="space-y-6">
            <Card title="Template do documento">
              <Select
                v-model="form.template_id"
                label="Template de orçamento"
                :options="templateOptions"
                placeholder="Selecione o template"
              />
              <p v-if="!budgetTemplates.length" class="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                Nenhum template de orçamento encontrado. Crie um em Documentos com tipo <strong>Orçamento</strong>.
              </p>
            </Card>

            <Card title="Identificação da obra">
              <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div class="sm:col-span-2">
                  <Input
                    v-model="form.work_name"
                    label="Nome da obra"
                    placeholder="Ex: Residência Alto da Boa Vista"
                  />
                </div>
                <Select
                  v-model="form.work_type"
                  label="Tipo da obra"
                  :options="WORK_TYPE_OPTIONS"
                  placeholder="Selecione o tipo"
                />
                <Input
                  v-model="form.location"
                  label="Localização"
                  placeholder="Ex: Rua das Acácias, 120 — Bairro Centro"
                />
                <Input
                  v-model="form.city_state"
                  label="Cidade/Estado"
                  placeholder="Ex: São Paulo/SP"
                />
              </div>
            </Card>

            <Card title="Características e parâmetros">
              <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Input
                  v-model="form.built_area"
                  label="Área construída (m²)"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Ex: 285.50"
                />
                <Input
                  v-model="form.floors"
                  label="Número de pavimentos"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Ex: 2"
                />
                <Select
                  v-model="form.construction_standard"
                  label="Padrão construtivo"
                  :options="CONSTRUCTION_STANDARD_OPTIONS"
                  placeholder="Selecione o padrão"
                />
                <Select
                  v-model="form.complexity"
                  label="Complexidade da obra"
                  :options="COMPLEXITY_OPTIONS"
                  placeholder="Selecione a complexidade"
                />
                <Input
                  v-model="form.deadline_months"
                  label="Prazo da obra (meses)"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Ex: 8"
                  helper-text="Informe em meses ou descreva abaixo."
                />
                <Input
                  v-model="form.deadline"
                  label="Prazo da obra (descrição)"
                  placeholder="Ex: 8 meses após liberação da ART"
                />
                <Input v-model="form.base_date" label="Data-base do orçamento" type="date" />
                <Select
                  v-model="form.adjustment_index"
                  label="Índice de reajuste"
                  :options="ADJUSTMENT_INDEX_OPTIONS"
                  placeholder="Selecione o índice"
                />
                <div v-if="form.adjustment_index === 'OUTRO'" class="sm:col-span-2">
                  <Input
                    v-model="form.adjustment_index_other"
                    label="Descrição do índice de reajuste"
                    placeholder="Ex: Índice contratual XYZ"
                  />
                </div>
              </div>
            </Card>
          </div>

          <div v-show="currentStep === 1">
            <Card title="Materiais do orçamento" subtitle="Base de insumos que será exibida ao cliente no relatório">
              <BudgetMaterialsPanel v-model="materials" />
            </Card>
          </div>

          <div v-show="currentStep === 2" class="space-y-6">
            <Card title="Revisão antes de gerar">
              <div class="grid gap-4 sm:grid-cols-2">
                <div class="rounded-lg border border-marble-200 bg-marble-50 p-4">
                  <p class="text-xs font-semibold uppercase tracking-wide text-marble-500">Template</p>
                  <p class="mt-1 font-medium text-marble-900">{{ selectedTemplate?.name || '—' }}</p>
                </div>
                <div class="rounded-lg border border-marble-200 bg-marble-50 p-4">
                  <p class="text-xs font-semibold uppercase tracking-wide text-marble-500">Data-base</p>
                  <p class="mt-1 font-medium text-marble-900">
                    {{
                      form.base_date
                        ? new Date(`${form.base_date}T12:00:00`).toLocaleDateString('pt-BR')
                        : '—'
                    }}
                  </p>
                </div>
              </div>

              <div class="mt-5 grid gap-3 sm:grid-cols-2">
                <div
                  v-for="item in summaryItems"
                  :key="item.label"
                  class="flex items-center justify-between rounded-lg border border-marble-200 px-3 py-2"
                >
                  <span class="text-sm text-marble-500">{{ item.label }}</span>
                  <span class="text-sm font-medium text-marble-900">{{ item.value }}</span>
                </div>
              </div>

              <div v-if="materials.length" class="mt-5 overflow-hidden rounded-lg border border-marble-200">
                <div class="border-b border-marble-200 bg-marble-50 px-4 py-2 text-sm font-medium text-marble-700">
                  Prévia da tabela de materiais no PDF
                </div>
                <div class="overflow-x-auto p-2">
                  <table class="min-w-full text-sm">
                    <thead>
                      <tr class="text-left text-xs uppercase text-marble-500">
                        <th class="px-2 py-2">Item</th>
                        <th class="px-2 py-2">Qtd</th>
                        <th class="px-2 py-2">Un.</th>
                        <th class="px-2 py-2">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in materials" :key="item.id" class="border-t border-marble-100">
                        <td class="px-2 py-2">{{ item.name }}</td>
                        <td class="px-2 py-2">{{ item.quantity }}</td>
                        <td class="px-2 py-2">{{ item.unit }}</td>
                        <td class="px-2 py-2 font-medium">
                          {{ formatCurrency((Number(item.quantity) || 0) * (Number(item.unit_price) || 0)) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <p v-else class="mt-4 text-sm text-marble-500">
                Nenhum material adicionado. O relatório exibirá uma mensagem informando que não há itens.
              </p>
            </Card>
          </div>

          <div class="flex flex-col-reverse gap-3 border-t border-marble-200 pt-4 sm:flex-row sm:justify-between">
            <div class="flex gap-2">
              <Button v-if="currentStep > 0" type="button" variant="ghost" @click="prevStep">
                <i class="fa-solid fa-arrow-left mr-2"></i>
                Voltar
              </Button>
            </div>
            <div class="flex gap-2 sm:justify-end">
              <Button
                v-if="currentStep < steps.length - 1"
                type="button"
                variant="secondary"
                @click="nextStep"
              >
                Continuar
                <i class="fa-solid fa-arrow-right ml-2"></i>
              </Button>
              <Button
                v-else
                type="submit"
                variant="primary"
                :loading="generating"
                :disabled="!budgetTemplates.length"
              >
                <i class="fa-solid fa-file-pdf mr-2"></i>
                Gerar orçamento em PDF
              </Button>
            </div>
          </div>
        </form>
      </div>

      <aside class="hidden lg:block">
        <div class="sticky top-6 space-y-4">
          <div class="rounded-xl border border-marble-200 bg-white p-5 shadow-sm">
            <h2 class="text-sm font-semibold text-marble-900">Resumo rápido</h2>
            <dl class="mt-4 space-y-3">
              <div v-for="item in summaryItems" :key="item.label">
                <dt class="text-xs text-marble-500">{{ item.label }}</dt>
                <dd class="mt-0.5 text-sm font-medium text-marble-900">{{ item.value }}</dd>
              </div>
            </dl>
          </div>

          <div class="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
            <p class="font-medium">Variável de tabela</p>
            <p class="mt-1 text-sky-800">
              No template, use <code class="rounded bg-white/70 px-1 font-mono text-xs">{{ materialsTableVariable }}</code>
              para inserir a tabela dinâmica de materiais no PDF.
            </p>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
