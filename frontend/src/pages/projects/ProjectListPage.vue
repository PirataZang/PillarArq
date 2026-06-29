<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/utils/Button.vue'
import Grid from '@/components/utils/Grid.vue'
import Input from '@/components/utils/Input.vue'
import Select from '@/components/utils/Select.vue'
import ProjectProgressCell from '@/components/projects/ProjectProgressCell.vue'
import ProjectStatusCell from '@/components/projects/ProjectStatusCell.vue'
import ProjectActionsCell from '@/components/projects/ProjectActionsCell.vue'
import { useSwal } from '@/utils/swal'
import { PROJECT_STATUS_OPTIONS } from '@/utils/projectLabels'
import api from '@/services/api'

const router = useRouter()
const swal = useSwal()

const viewTabs = [
  { id: 'active', label: 'Ativos' },
  { id: 'archived', label: 'Arquivados' },
  { id: 'filters', label: 'Filtros' },
]

const activeView = ref('active')
const returnView = ref('active')
const search = ref('')
const searchDebounced = ref('')
const projects = ref([])
const totalProjects = ref(0)
const clients = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

let searchTimeout = null

const filters = reactive({
  status: '',
  client_id: '',
  start_date_from: '',
  start_date_to: '',
  expected_end_date_from: '',
  expected_end_date_to: '',
  progress_min: '',
  progress_max: '',
})

const appliedFilters = ref({})

const statusFilterOptions = computed(() =>
  PROJECT_STATUS_OPTIONS.filter((option) => option.value !== 'ARCHIVED')
)

const clientOptions = computed(() =>
  clients.value.map((client) => ({
    value: String(client.id),
    label: client.name,
  }))
)

const columnDefs = [
  {
    field: 'name',
    headerName: 'Projeto',
    flex: 1.2,
    minWidth: 180,
    filter: false,
    cellClass: 'font-medium text-marble-900',
  },
  {
    field: 'client.name',
    headerName: 'Cliente',
    flex: 1,
    minWidth: 160,
    filter: false,
    valueGetter: (params) => params.data?.client?.name ?? '—',
  },
  {
    field: 'progress_percent',
    headerName: 'Progresso',
    width: 150,
    filter: false,
    sortable: true,
    cellRenderer: ProjectProgressCell,
  },
  {
    field: 'start_date',
    headerName: 'Data de início',
    width: 130,
    filter: false,
    valueFormatter: (params) => formatDate(params.value),
  },
  {
    field: 'expected_end_date',
    headerName: 'Data de entrega',
    width: 140,
    filter: false,
    valueFormatter: (params) => formatDate(params.value),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 150,
    filter: false,
    cellRenderer: ProjectStatusCell,
  },
  {
    field: 'actions',
    headerName: '',
    width: 90,
    sortable: false,
    filter: false,
    cellRenderer: ProjectActionsCell,
    pinned: 'right',
  },
]

const gridContext = computed(() => ({
  showArchive: activeView.value === 'active',
  onArchive: confirmArchiveOne,
}))

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return projects.value.slice(start, start + pageSize.value)
})

const activeFiltersCount = computed(() => {
  return Object.values(appliedFilters.value).filter((value) => value !== '' && value !== null && value !== undefined).length
})

function formatDate(value) {
  if (!value) return '—'
  const [year, month, day] = String(value).split('-')
  if (!year || !month || !day) return value
  return `${day}/${month}/${year}`
}

function buildQueryParams() {
  const params = {
    archived: activeView.value === 'archived',
  }

  if (searchDebounced.value.trim()) {
    params.search = searchDebounced.value.trim()
  }

  for (const [key, value] of Object.entries(appliedFilters.value)) {
    if (value !== '' && value !== null && value !== undefined) {
      params[key] = value
    }
  }

  return params
}

const fetchProjects = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/projects', { params: buildQueryParams() })
    if (data?.success) {
      projects.value = data.data
      totalProjects.value = data.meta?.total ?? data.data.length
      currentPage.value = 1
    }
  } catch (err) {
    console.error('Failed to load projects:', err)
    swal.error('Erro', 'Não foi possível carregar as obras.')
  } finally {
    loading.value = false
  }
}

const fetchClients = async () => {
  try {
    const { data } = await api.get('/clients')
    if (data?.success) {
      clients.value = data.data
    }
  } catch (err) {
    console.error('Failed to load clients:', err)
  }
}

onMounted(() => {
  fetchClients()
  fetchProjects()
})

watch(search, (value) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    searchDebounced.value = value
    if (activeView.value !== 'filters') {
      fetchProjects()
    }
  }, 350)
})

watch(activeView, (view, oldView) => {
  if (view === 'filters' && oldView !== 'filters') {
    returnView.value = oldView
  }
  if (view !== 'filters') {
    fetchProjects()
  }
})

const applyFilters = () => {
  appliedFilters.value = {
    status: filters.status || undefined,
    client_id: filters.client_id || undefined,
    start_date_from: filters.start_date_from || undefined,
    start_date_to: filters.start_date_to || undefined,
    expected_end_date_from: filters.expected_end_date_from || undefined,
    expected_end_date_to: filters.expected_end_date_to || undefined,
    progress_min: filters.progress_min !== '' ? Number(filters.progress_min) : undefined,
    progress_max: filters.progress_max !== '' ? Number(filters.progress_max) : undefined,
  }

  activeView.value = returnView.value === 'filters' ? 'active' : returnView.value
  fetchProjects()
}

const clearFilters = () => {
  filters.status = ''
  filters.client_id = ''
  filters.start_date_from = ''
  filters.start_date_to = ''
  filters.expected_end_date_from = ''
  filters.expected_end_date_to = ''
  filters.progress_min = ''
  filters.progress_max = ''
  appliedFilters.value = {}
  fetchProjects()
}

const goToCreate = () => router.push('/projects/create')

const openProject = (project) => {
  if (project?.id) {
    router.push(`/projects/${project.id}`)
  }
}

const confirmArchiveOne = async (project) => {
  const confirmed = await swal.confirm('Arquivar obra', `Deseja arquivar "${project.name}"?`)
  if (!confirmed) return

  try {
    await api.delete(`/projects/${project.id}`)
    swal.success('Obra arquivada com sucesso!')
    await fetchProjects()
  } catch (err) {
    swal.error('Erro', 'Não foi possível arquivar a obra.')
  }
}
</script>

<template>
  <div>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
      <div>
        <h1 class="text-2xl font-bold text-marble-900 tracking-tight">Obras</h1>
        <p class="mt-1 text-sm text-marble-600">
          Gerencie obras, orçamentos, materiais, gastos e progresso.
        </p>
      </div>
      <Button variant="primary" @click="goToCreate">
        <i class="fa-solid fa-plus mr-2"></i>
        Nova Obra
      </Button>
    </div>

    <div class="inline-flex items-center gap-1 p-1 bg-marble-100 rounded-xl mb-4">
      <button
        v-for="tab in viewTabs"
        :key="tab.id"
        type="button"
        class="px-4 py-2 text-sm font-medium rounded-lg transition-all"
        :class="
          activeView === tab.id
            ? 'bg-charcoal text-white shadow-sm'
            : 'text-marble-600 hover:text-marble-900 hover:bg-white/70'
        "
        @click="activeView = tab.id"
      >
        {{ tab.label }}
        <span
          v-if="tab.id === 'filters' && activeFiltersCount > 0"
          class="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] rounded-full bg-white/20"
          :class="activeView === tab.id ? 'text-white' : 'bg-marble-200 text-marble-700'"
        >
          {{ activeFiltersCount }}
        </span>
      </button>
    </div>

    <div v-if="activeView === 'filters'" class="bg-white rounded-xl shadow-sm ring-1 ring-marble-200 p-5 mb-4">
      <h2 class="text-sm font-semibold text-marble-900 mb-4">Filtrar obras</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Select
          v-model="filters.status"
          label="Status"
          placeholder="Todos"
          :options="[{ value: '', label: 'Todos' }, ...statusFilterOptions]"
          :clearable="false"
        />
        <Select
          v-model="filters.client_id"
          label="Cliente"
          placeholder="Todos"
          search
          :options="[{ value: '', label: 'Todos' }, ...clientOptions]"
          :clearable="false"
        />
        <Input v-model="filters.progress_min" label="Progresso mínimo (%)" type="number" placeholder="0" />
        <Input v-model="filters.progress_max" label="Progresso máximo (%)" type="number" placeholder="100" />
        <Input v-model="filters.start_date_from" label="Início a partir de" type="date" />
        <Input v-model="filters.start_date_to" label="Início até" type="date" />
        <Input v-model="filters.expected_end_date_from" label="Entrega a partir de" type="date" />
        <Input v-model="filters.expected_end_date_to" label="Entrega até" type="date" />
      </div>
      <div class="mt-5 flex flex-wrap justify-end gap-2">
        <Button variant="secondary" size="sm" @click="clearFilters">Limpar filtros</Button>
        <Button variant="primary" size="sm" @click="applyFilters">
          <i class="fa-solid fa-filter mr-1.5"></i>
          Aplicar filtros
        </Button>
      </div>
    </div>

    <template v-else>
      <div class="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
        <p class="text-sm text-marble-600 shrink-0">
          <span class="font-semibold text-marble-900">{{ projects.length }}</span>
          resultado(s) encontrado(s)
        </p>

        <div class="flex-1 max-w-xl mx-auto w-full">
          <div class="relative">
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-marble-400 text-sm"></i>
            <input
              v-model="search"
              type="search"
              placeholder="Pesquisar obra, cliente ou endereço..."
              class="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-marble-200 bg-white text-marble-900 placeholder:text-marble-400 focus:outline-none focus:ring-2 focus:ring-marble-400/30 focus:border-marble-400"
            />
          </div>
        </div>

        <button
          type="button"
          class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-marble-700 hover:text-marble-900 hover:bg-marble-100 rounded-lg transition-colors shrink-0"
          @click="activeView = 'filters'"
        >
          <i class="fa-solid fa-filter text-marble-500"></i>
          Filtrar por
          <span
            v-if="activeFiltersCount > 0"
            class="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] rounded-full bg-charcoal text-white"
          >
            {{ activeFiltersCount }}
          </span>
        </button>
      </div>

      <div
        class="bg-white w-full rounded-xl shadow-sm ring-1 ring-marble-200 overflow-hidden"
        :class="{ 'opacity-60 pointer-events-none': loading }"
      >
        <Grid
          :rowData="paginatedProjects"
          :columnDefs="columnDefs"
          :totalRows="projects.length"
          :currentPage="currentPage"
          :pageSize="pageSize"
          :selectable="false"
          grid-height="calc(100vh - 320px)"
          :context="gridContext"
          :defaultColDef="{ sortable: true, filter: false, resizable: false }"
          @update:page="currentPage = $event"
          @update:pageSize="pageSize = $event"
          @row-click="openProject"
        />
      </div>
    </template>
  </div>
</template>
