<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Card from '@/components/utils/Card.vue'
import Button from '@/components/utils/Button.vue'
import Input from '@/components/utils/Input.vue'
import Textarea from '@/components/utils/Textarea.vue'
import Select from '@/components/utils/Select.vue'
import { useSwal } from '@/utils/swal'
import { formatCurrency } from '@/utils/currency'
import {
  PROJECT_STATUS_LABELS,
  EXPENSE_CATEGORY_OPTIONS,
  EXPENSE_CATEGORY_LABELS,
} from '@/utils/projectLabels'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const swal = useSwal()

const projectId = computed(() => route.params.id)
const project = ref(null)
const loading = ref(true)
const activeTab = ref('overview')

const tabs = [
  { id: 'overview', label: 'Visão geral', icon: 'fa-chart-pie' },
  { id: 'budget', label: 'Orçamento', icon: 'fa-calculator' },
  { id: 'materials', label: 'Materiais', icon: 'fa-boxes-stacked' },
  { id: 'expenses', label: 'Gastos', icon: 'fa-receipt' },
  { id: 'progress', label: 'Progresso', icon: 'fa-list-check' },
  { id: 'notes', label: 'Anotações', icon: 'fa-note-sticky' },
]

const materialForm = reactive({
  name: '',
  quantity: '1',
  unit: 'un',
  unit_price: '',
  supplier: '',
})

const expenseForm = reactive({
  expense_date: new Date().toISOString().slice(0, 10),
  category: 'OTHER',
  description: '',
  amount: '',
})

const noteForm = reactive({ content: '' })
const expandedExpenseId = ref(null)

const budget = computed(() => project.value?.budget_summary ?? {})
const materials = computed(() => project.value?.materials ?? [])
const expenses = computed(() => project.value?.expenses ?? [])
const phases = computed(() => project.value?.phases ?? [])
const notes = computed(() => project.value?.notes ?? [])

const loadProject = async () => {
  loading.value = true
  try {
    const { data } = await api.get(`/projects/${projectId.value}`)
    if (data?.success) {
      project.value = data.data
    }
  } catch (err) {
    swal.error('Erro', 'Não foi possível carregar a obra.')
    router.push('/projects')
  } finally {
    loading.value = false
  }
}

onMounted(loadProject)

const addMaterial = async () => {
  try {
    await api.post(`/projects/${projectId.value}/materials`, {
      name: materialForm.name,
      quantity: Number(materialForm.quantity),
      unit: materialForm.unit,
      unit_price: Number(materialForm.unit_price),
      supplier: materialForm.supplier || undefined,
    })
    materialForm.name = ''
    materialForm.quantity = '1'
    materialForm.unit_price = ''
    materialForm.supplier = ''
    await loadProject()
  } catch (err) {
    swal.error('Erro', err.response?.data?.message || 'Não foi possível adicionar o material.')
  }
}

const removeMaterial = async (materialId) => {
  const confirmed = await swal.confirm('Remover material', 'Deseja remover este item?')
  if (!confirmed) return
  await api.delete(`/projects/${projectId.value}/materials/${materialId}`)
  await loadProject()
}

const addExpense = async () => {
  try {
    await api.post(`/projects/${projectId.value}/expenses`, {
      expense_date: expenseForm.expense_date,
      category: expenseForm.category,
      description: expenseForm.description,
      amount: Number(expenseForm.amount),
    })
    expenseForm.description = ''
    expenseForm.amount = ''
    await loadProject()
  } catch (err) {
    swal.error('Erro', err.response?.data?.message || 'Não foi possível registrar o gasto.')
  }
}

const removeExpense = async (expenseId) => {
  const confirmed = await swal.confirm('Remover gasto', 'Deseja remover este lançamento?')
  if (!confirmed) return
  await api.delete(`/projects/${projectId.value}/expenses/${expenseId}`)
  if (expandedExpenseId.value === expenseId) {
    expandedExpenseId.value = null
  }
  await loadProject()
}

const toggleExpense = (expenseId) => {
  expandedExpenseId.value = expandedExpenseId.value === expenseId ? null : expenseId
}

const getExpenseCategoryLabel = (category) => EXPENSE_CATEGORY_LABELS[category] ?? category

const togglePhase = async (phase) => {
  await api.patch(`/projects/${projectId.value}/phases/${phase.id}`, {
    is_completed: !phase.is_completed,
  })
  await loadProject()
}

const addNote = async () => {
  try {
    await api.post(`/projects/${projectId.value}/notes`, { content: noteForm.content })
    noteForm.content = ''
    await loadProject()
  } catch (err) {
    swal.error('Erro', err.response?.data?.message || 'Não foi possível salvar a anotação.')
  }
}

const removeNote = async (noteId) => {
  const confirmed = await swal.confirm('Remover anotação', 'Deseja remover esta anotação?')
  if (!confirmed) return
  await api.delete(`/projects/${projectId.value}/notes/${noteId}`)
  await loadProject()
}
</script>

<template>
  <div v-if="loading" class="flex justify-center py-20 text-marble-500">Carregando obra...</div>

  <div v-else-if="project">
    <div class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div class="flex items-start gap-4">
        <button
          @click="router.push('/projects')"
          class="p-2 -ml-2 rounded-md text-marble-400 hover:text-marble-900 hover:bg-marble-100 transition-colors"
        >
          <i class="fa-solid fa-arrow-left text-lg"></i>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-marble-900 tracking-tight">{{ project.name }}</h1>
          <p class="mt-1 text-sm text-marble-600">
            {{ project.client?.name }} · {{ PROJECT_STATUS_LABELS[project.status] }} ·
            {{ project.progress_percent }}% concluído
          </p>
        </div>
      </div>
      <Button variant="secondary" @click="router.push(`/projects/${project.id}/edit`)">
        <i class="fa-solid fa-pen mr-2"></i>
        Editar obra
      </Button>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <div class="bg-white rounded-lg ring-1 ring-marble-200 px-3 py-2.5">
        <p class="text-[11px] text-marble-500 uppercase tracking-wide">Orçado</p>
        <p class="text-lg font-semibold text-marble-900 mt-0.5">{{ formatCurrency(budget.budget_total) }}</p>
      </div>
      <div class="bg-white rounded-lg ring-1 ring-marble-200 px-3 py-2.5">
        <p class="text-[11px] text-marble-500 uppercase tracking-wide">Gasto</p>
        <p class="text-lg font-semibold text-marble-900 mt-0.5">{{ formatCurrency(budget.expenses_total) }}</p>
      </div>
      <div class="bg-white rounded-lg ring-1 ring-marble-200 px-3 py-2.5">
        <p class="text-[11px] text-marble-500 uppercase tracking-wide">Saldo</p>
        <p
          class="text-lg font-semibold mt-0.5"
          :class="budget.balance >= 0 ? 'text-green-700' : 'text-red-700'"
        >
          {{ formatCurrency(budget.balance) }}
        </p>
      </div>
      <div class="bg-white rounded-lg ring-1 ring-marble-200 px-3 py-2.5">
        <p class="text-[11px] text-marble-500 uppercase tracking-wide">Área</p>
        <p class="text-lg font-semibold text-marble-900 mt-0.5">{{ budget.area_m2 }} m²</p>
      </div>
    </div>

    <div class="border-b border-marble-200 mb-4">
      <nav class="flex gap-1 overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
          :class="
            activeTab === tab.id
              ? 'border-charcoal text-marble-900'
              : 'border-transparent text-marble-500 hover:text-marble-700'
          "
        >
          <i :class="['fa-solid', tab.icon]"></i>
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Overview -->
    <div v-if="activeTab === 'overview'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="Informações">
        <dl class="space-y-3 text-sm">
          <div class="flex justify-between gap-4">
            <dt class="text-marble-500">Cliente</dt>
            <dd class="text-marble-900 font-medium">{{ project.client?.name }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-marble-500">Endereço</dt>
            <dd class="text-marble-900 text-right">{{ project.address || '—' }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-marble-500">Início</dt>
            <dd class="text-marble-900">{{ project.start_date || '—' }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-marble-500">Previsão</dt>
            <dd class="text-marble-900">{{ project.expected_end_date || '—' }}</dd>
          </div>
        </dl>
      </Card>
      <Card title="Últimas anotações">
        <div v-if="notes.length === 0" class="text-sm text-marble-500">Nenhuma anotação registrada.</div>
        <div v-else class="space-y-3">
          <div v-for="note in notes.slice(0, 3)" :key="note.id" class="text-sm border-b border-marble-100 pb-3">
            <p class="text-marble-800">{{ note.content }}</p>
            <p class="text-xs text-marble-400 mt-1">{{ note.created_at }}</p>
          </div>
        </div>
      </Card>
    </div>

    <!-- Budget -->
    <Card v-if="activeTab === 'budget'" title="Calculadora da obra">
      <dl class="space-y-4 text-sm max-w-lg">
        <div class="flex justify-between">
          <dt class="text-marble-600">Honorário ({{ budget.area_m2 }} m² × {{ formatCurrency(budget.service_rate) }})</dt>
          <dd class="font-medium">{{ formatCurrency(budget.service_amount) }}</dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-marble-600">Extras</dt>
          <dd class="font-medium">{{ formatCurrency(budget.extras_total) }}</dd>
        </div>
        <div class="flex justify-between border-t border-marble-200 pt-4 text-base">
          <dt class="font-semibold text-marble-900">Total orçado</dt>
          <dd class="font-semibold">{{ formatCurrency(budget.budget_total) }}</dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-marble-600">Materiais</dt>
          <dd class="font-medium text-red-700">{{ formatCurrency(budget.materials_total) }}</dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-marble-600">Outros gastos</dt>
          <dd class="font-medium text-red-700">
            {{ formatCurrency(budget.expenses_total - budget.materials_total) }}
          </dd>
        </div>
        <div class="flex justify-between border-t border-marble-200 pt-2">
          <dt class="font-semibold text-marble-900">Total gasto</dt>
          <dd class="font-semibold text-red-700">{{ formatCurrency(budget.expenses_total) }}</dd>
        </div>
        <div class="flex justify-between border-t border-marble-200 pt-4 text-base">
          <dt class="font-semibold text-marble-900">Saldo disponível</dt>
          <dd class="font-semibold" :class="budget.balance >= 0 ? 'text-green-700' : 'text-red-700'">
            {{ formatCurrency(budget.balance) }}
          </dd>
        </div>
      </dl>
    </Card>

    <!-- Materials -->
    <div v-if="activeTab === 'materials'" class="space-y-6">
      <Card title="Adicionar material">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Input v-model="materialForm.name" label="Item" placeholder="Porcelanato 60x60" />
          <Input v-model="materialForm.quantity" label="Qtd" type="number" />
          <Input v-model="materialForm.unit" label="Unidade" placeholder="m²" />
          <Input v-model="materialForm.unit_price" label="Preço unit." type="number" />
          <Input v-model="materialForm.supplier" label="Fornecedor" />
        </div>
        <div class="mt-4 flex justify-end">
          <Button variant="primary" @click="addMaterial">
            <i class="fa-solid fa-plus mr-2"></i>
            Adicionar
          </Button>
        </div>
      </Card>

      <Card title="Lista de materiais">
        <div v-if="materials.length === 0" class="text-sm text-marble-500">Nenhum material cadastrado.</div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="border-b border-marble-200 text-left text-marble-500">
                <th class="py-2 pr-4">Item</th>
                <th class="py-2 pr-4">Qtd</th>
                <th class="py-2 pr-4">Un.</th>
                <th class="py-2 pr-4">Preço un.</th>
                <th class="py-2 pr-4">Subtotal</th>
                <th class="py-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in materials" :key="item.id" class="border-b border-marble-100">
                <td class="py-3 pr-4">{{ item.name }}</td>
                <td class="py-3 pr-4">{{ item.quantity }}</td>
                <td class="py-3 pr-4">{{ item.unit }}</td>
                <td class="py-3 pr-4">{{ formatCurrency(item.unit_price) }}</td>
                <td class="py-3 pr-4 font-medium">{{ formatCurrency(item.subtotal) }}</td>
                <td class="py-3 text-right">
                  <button class="text-red-600 hover:text-red-800" @click="removeMaterial(item.id)">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>

    <!-- Expenses -->
    <div v-if="activeTab === 'expenses'" class="space-y-4">
      <div class="bg-white rounded-lg ring-1 ring-marble-200 overflow-hidden">
        <div class="px-4 py-2.5 border-b border-marble-100 bg-marble-50/50">
          <h3 class="text-sm font-semibold text-marble-900">Registrar gasto</h3>
        </div>
        <div class="p-4 space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input v-model="expenseForm.expense_date" label="Data" type="date" />
            <Select
              v-model="expenseForm.category"
              label="Categoria"
              :options="EXPENSE_CATEGORY_OPTIONS"
            />
            <Input v-model="expenseForm.amount" label="Valor (R$)" type="number" />
          </div>
          <Textarea
            v-model="expenseForm.description"
            label="Descrição"
            rows="2"
            placeholder="Detalhes do gasto..."
          />
          <div class="flex justify-end pt-1">
            <Button variant="primary" size="sm" @click="addExpense">
              <i class="fa-solid fa-plus mr-1.5"></i>
              Registrar
            </Button>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg ring-1 ring-marble-200 overflow-hidden">
        <div class="px-4 py-2.5 border-b border-marble-100 bg-marble-50/50">
          <h3 class="text-sm font-semibold text-marble-900">Gastos da obra</h3>
        </div>
        <div class="p-4">
          <div v-if="expenses.length === 0" class="text-sm text-marble-500 py-2">Nenhum gasto registrado.</div>
          <div v-else class="space-y-2">
            <div
              v-for="expense in expenses"
              :key="expense.id"
              class="rounded-lg border transition-colors"
              :class="
                expandedExpenseId === expense.id
                  ? 'border-marble-300 ring-1 ring-marble-200'
                  : 'border-marble-200 hover:border-marble-300'
              "
            >
              <div
                class="flex items-center gap-2 px-3 py-2 text-sm"
                :class="expandedExpenseId === expense.id ? 'bg-marble-50' : 'bg-white'"
              >
                <button
                  type="button"
                  class="flex-1 flex items-center gap-3 min-w-0 text-left"
                  @click="toggleExpense(expense.id)"
                >
                  <span class="w-[92px] shrink-0 text-xs text-marble-500 tabular-nums">
                    {{ expense.expense_date }}
                  </span>
                  <span class="flex-1 min-w-0 truncate text-marble-700">
                    {{ getExpenseCategoryLabel(expense.category) }}
                  </span>
                  <span class="w-[88px] shrink-0 text-right font-medium text-marble-900 tabular-nums">
                    {{ formatCurrency(expense.amount) }}
                  </span>
                  <i
                    class="fa-solid fa-chevron-down text-[10px] text-marble-400 shrink-0 transition-transform duration-200"
                    :class="{ 'rotate-180': expandedExpenseId === expense.id }"
                  ></i>
                </button>
                <button
                  type="button"
                  class="text-marble-400 hover:text-red-600 shrink-0 p-1 transition-colors"
                  title="Remover gasto"
                  @click="removeExpense(expense.id)"
                >
                  <i class="fa-solid fa-trash text-xs"></i>
                </button>
              </div>

              <div
                v-show="expandedExpenseId === expense.id"
                class="px-3 pb-3 pt-2 border-t border-marble-100 bg-white"
              >
                <Textarea
                  :model-value="expense.description"
                  label="Descrição"
                  :min-height="300"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress -->
    <Card v-if="activeTab === 'progress'" title="Etapas da obra">
      <div class="mb-4">
        <div class="flex justify-between text-sm mb-2">
          <span class="text-marble-600">Progresso geral</span>
          <span class="font-medium">{{ project.progress_percent }}%</span>
        </div>
        <div class="w-full bg-marble-200 rounded-full h-2">
          <div
            class="bg-charcoal h-2 rounded-full transition-all"
            :style="{ width: `${project.progress_percent}%` }"
          ></div>
        </div>
      </div>
      <div class="space-y-2">
        <label
          v-for="phase in phases"
          :key="phase.id"
          class="flex items-start gap-3 p-3 rounded-lg border border-marble-200 hover:bg-marble-50 cursor-pointer"
        >
          <input
            type="checkbox"
            :checked="phase.is_completed"
            class="h-4 w-4 mt-0.5 rounded border-marble-300 text-marble-700 shrink-0"
            @change="togglePhase(phase)"
          />
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <p class="text-sm font-medium text-marble-900">{{ phase.name }}</p>
              <span class="text-xs text-marble-500 bg-marble-100 px-2 py-0.5 rounded">
                {{ phase.weight_percent }}%
              </span>
            </div>
            <p v-if="phase.description" class="text-xs text-marble-500 mt-1.5 whitespace-pre-wrap">
              {{ phase.description }}
            </p>
          </div>
        </label>
      </div>
    </Card>

    <!-- Notes -->
    <div v-if="activeTab === 'notes'" class="space-y-6">
      <Card title="Nova anotação">
        <Textarea v-model="noteForm.content" label="Conteúdo" rows="4" placeholder="Visita de obra, decisão do cliente..." />
        <div class="mt-4 flex justify-end">
          <Button variant="primary" @click="addNote">
            <i class="fa-solid fa-plus mr-2"></i>
            Salvar anotação
          </Button>
        </div>
      </Card>

      <Card title="Histórico">
        <div v-if="notes.length === 0" class="text-sm text-marble-500">Nenhuma anotação ainda.</div>
        <div v-else class="space-y-4">
          <div
            v-for="note in notes"
            :key="note.id"
            class="flex justify-between gap-4 border-b border-marble-100 pb-4"
          >
            <div>
              <p class="text-sm text-marble-800 whitespace-pre-wrap">{{ note.content }}</p>
              <p class="text-xs text-marble-400 mt-2">
                {{ note.author?.name ?? 'Usuário' }} · {{ note.created_at }}
              </p>
            </div>
            <button class="text-red-600 hover:text-red-800 shrink-0" @click="removeNote(note.id)">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
