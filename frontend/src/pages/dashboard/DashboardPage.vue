<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import Card from '@/components/utils/Card.vue'
import Button from '@/components/utils/Button.vue'
import Input from '@/components/utils/Input.vue'
import Select from '@/components/utils/Select.vue'
import DashboardChart from '@/components/dashboard/DashboardChart.vue'
import { formatCurrency } from '@/utils/currency'
import { PROJECT_STATUS_OPTIONS } from '@/utils/projectLabels'
import api from '@/services/api'

const loading = ref(true)
const stats = ref(null)

const now = new Date()
const defaultFrom = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
const defaultTo = now.toISOString().slice(0, 10)

const filters = reactive({
  period_from: defaultFrom,
  period_to: defaultTo,
  status: '',
})

const statusFilterOptions = computed(() => [
  { value: '', label: 'Todos os status' },
  ...PROJECT_STATUS_OPTIONS.filter((option) => option.value !== 'ARCHIVED'),
])

const summary = computed(() => stats.value?.summary ?? {})
const period = computed(() => stats.value?.period ?? { from: filters.period_from, to: filters.period_to })

const summaryCards = computed(() => [
  {
    id: 'projects',
    label: 'Obras no período',
    value: summary.value.projects_count ?? 0,
    icon: 'fa-building',
  },
  {
    id: 'progress',
    label: 'Progresso médio',
    value: `${summary.value.average_progress ?? 0}%`,
    icon: 'fa-chart-line',
  },
  {
    id: 'clients',
    label: 'Novos clientes',
    value: summary.value.new_clients_count ?? 0,
    icon: 'fa-user-plus',
  },
  {
    id: 'budget',
    label: 'Média orçada',
    value: formatCurrency(summary.value.average_budget ?? 0),
    icon: 'fa-calculator',
  },
  {
    id: 'expenses',
    label: 'Média de gastos',
    value: formatCurrency(summary.value.average_expenses ?? 0),
    icon: 'fa-receipt',
  },
])

function progressColor(value) {
  if (value >= 75) return '#16a34a'
  if (value >= 40) return '#d97706'
  return '#3b82f6'
}

const projectsTimelineOption = computed(() => {
  const timeline = stats.value?.projects_timeline ?? []
  return {
    color: ['#5c5852'],
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 16, top: 24, bottom: 28 },
    xAxis: {
      type: 'category',
      data: timeline.map((item) => item.label),
      axisLine: { lineStyle: { color: '#d4d0ca' } },
      axisLabel: { color: '#7a746c' },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#f0eeea' } },
      axisLabel: { color: '#7a746c' },
    },
    series: [
      {
        name: 'Obras',
        type: 'bar',
        barWidth: '45%',
        data: timeline.map((item) => item.count),
        itemStyle: { borderRadius: [6, 6, 0, 0] },
      },
    ],
  }
})

const clientsTimelineOption = computed(() => {
  const timeline = stats.value?.clients_timeline ?? []
  return {
    color: ['#3b82f6'],
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 16, top: 24, bottom: 28 },
    xAxis: {
      type: 'category',
      data: timeline.map((item) => item.label),
      axisLine: { lineStyle: { color: '#d4d0ca' } },
      axisLabel: { color: '#7a746c' },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#f0eeea' } },
      axisLabel: { color: '#7a746c' },
    },
    series: [
      {
        name: 'Clientes',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        areaStyle: { color: 'rgba(59, 130, 246, 0.12)' },
        data: timeline.map((item) => item.count),
      },
    ],
  }
})

const statusChartOption = computed(() => {
  const items = (stats.value?.projects_by_status ?? []).filter((item) => item.count > 0)
  const colors = {
    DRAFT: '#94a3b8',
    BUDGETING: '#38bdf8',
    IN_PROGRESS: '#f59e0b',
    ON_HOLD: '#fb923c',
    COMPLETED: '#22c55e',
  }

  return {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: '#5c5852' } },
    series: [
      {
        type: 'pie',
        radius: ['42%', '68%'],
        center: ['50%', '45%'],
        itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
        label: { formatter: '{b}\n{c}' },
        data: items.map((item) => ({
          name: item.label,
          value: item.count,
          itemStyle: { color: colors[item.status] ?? '#5c5852' },
        })),
      },
    ],
  }
})

const progressChartOption = computed(() => {
  const items = stats.value?.projects_progress ?? []

  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const item = params[0]
        return `${item.name}<br/>${item.value}%`
      },
    },
    grid: { left: 120, right: 24, top: 16, bottom: 24 },
    xAxis: {
      type: 'value',
      max: 100,
      axisLabel: { formatter: '{value}%', color: '#7a746c' },
      splitLine: { lineStyle: { color: '#f0eeea' } },
    },
    yAxis: {
      type: 'category',
      data: items.map((item) => item.name),
      axisLabel: {
        color: '#5c5852',
        width: 100,
        overflow: 'truncate',
      },
    },
    series: [
      {
        type: 'bar',
        data: items.map((item) => ({
          value: item.progress,
          itemStyle: { color: progressColor(item.progress), borderRadius: [0, 6, 6, 0] },
        })),
        barWidth: 14,
        label: {
          show: true,
          position: 'right',
          formatter: '{c}%',
          color: '#5c5852',
        },
      },
    ],
  }
})

const averagesChartOption = computed(() => {
  const budget = summary.value.average_budget ?? 0
  const expenses = summary.value.average_expenses ?? 0

  return {
    color: ['#5c5852', '#dc2626'],
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value) => formatCurrency(value),
    },
    grid: { left: 48, right: 16, top: 24, bottom: 28 },
    xAxis: {
      type: 'category',
      data: ['Média orçada', 'Média de gastos'],
      axisLine: { lineStyle: { color: '#d4d0ca' } },
      axisLabel: { color: '#5c5852' },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#7a746c',
        formatter: (value) =>
          new Intl.NumberFormat('pt-BR', {
            notation: 'compact',
            compactDisplay: 'short',
          }).format(value),
      },
      splitLine: { lineStyle: { color: '#f0eeea' } },
    },
    series: [
      {
        type: 'bar',
        barWidth: '40%',
        data: [budget, expenses],
        itemStyle: { borderRadius: [6, 6, 0, 0] },
      },
    ],
  }
})

const loadDashboard = async () => {
  loading.value = true
  try {
    const params = {
      period_from: filters.period_from,
      period_to: filters.period_to,
    }
    if (filters.status) {
      params.status = filters.status
    }

    const { data } = await api.get('/dashboard', { params })
    if (data?.success) {
      stats.value = data.data
    }
  } catch (err) {
    console.error('Failed to load dashboard:', err)
  } finally {
    loading.value = false
  }
}

const applyFilters = () => loadDashboard()

const resetFilters = () => {
  filters.period_from = defaultFrom
  filters.period_to = defaultTo
  filters.status = ''
  loadDashboard()
}

onMounted(loadDashboard)
</script>

<template>
  <div>
    <div class="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-marble-900 tracking-tight">Dashboard</h1>
        <p class="mt-1 text-sm text-marble-600">
          Visão geral do escritório
          <span v-if="period.from && period.to" class="text-marble-400">
            · {{ period.from }} até {{ period.to }}
          </span>
        </p>
      </div>
    </div>

    <div class="bg-white rounded-xl ring-1 ring-marble-200 p-4 mb-5">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
        <Input v-model="filters.period_from" label="Período de" type="date" />
        <Input v-model="filters.period_to" label="Período até" type="date" />
        <Select
          v-model="filters.status"
          label="Status da obra"
          :options="statusFilterOptions"
          :clearable="false"
        />
        <div class="flex gap-2">
          <Button variant="secondary" size="sm" class="flex-1" @click="resetFilters">
            Limpar
          </Button>
          <Button variant="primary" size="sm" class="flex-1" :disabled="loading" @click="applyFilters">
            Aplicar
          </Button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
      <div
        v-for="card in summaryCards"
        :key="card.id"
        class="bg-white rounded-xl ring-1 ring-marble-200 px-4 py-3"
      >
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-marble-100 flex items-center justify-center shrink-0">
            <i :class="['fa-solid', card.icon, 'text-marble-600 text-sm']"></i>
          </div>
          <div class="min-w-0">
            <p class="text-[11px] uppercase tracking-wide text-marble-500 truncate">{{ card.label }}</p>
            <p class="text-lg font-semibold text-marble-900 truncate">{{ card.value }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-sm text-marble-500 py-12 text-center">Carregando indicadores...</div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <Card title="Obras criadas no período" no-padding>
        <div class="p-4 pt-2">
          <DashboardChart :option="projectsTimelineOption" height="280px" />
        </div>
      </Card>

      <Card title="Novos clientes no período" no-padding>
        <div class="p-4 pt-2">
          <DashboardChart :option="clientsTimelineOption" height="280px" />
        </div>
      </Card>

      <Card title="Obras por status" no-padding>
        <div class="p-4 pt-2">
          <DashboardChart
            v-if="(stats?.projects_by_status ?? []).some((item) => item.count > 0)"
            :option="statusChartOption"
            height="300px"
          />
          <div v-else class="h-[300px] flex items-center justify-center text-sm text-marble-400">
            Nenhuma obra no período selecionado.
          </div>
        </div>
      </Card>

      <Card title="Progresso das obras" no-padding>
        <div class="p-4 pt-2">
          <DashboardChart
            v-if="(stats?.projects_progress ?? []).length"
            :option="progressChartOption"
            height="300px"
          />
          <div v-else class="h-[300px] flex items-center justify-center text-sm text-marble-400">
            Nenhuma obra para exibir progresso.
          </div>
        </div>
      </Card>

      <Card title="Médias financeiras por obra" class="lg:col-span-2" no-padding>
        <div class="p-4 pt-2">
          <DashboardChart :option="averagesChartOption" height="260px" />
        </div>
      </Card>
    </div>
  </div>
</template>
