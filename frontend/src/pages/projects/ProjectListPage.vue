<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/utils/Button.vue'
import Grid from '@/components/utils/Grid.vue'
import { useSwal } from '@/utils/swal'
import { formatCurrency } from '@/utils/currency'
import { PROJECT_STATUS_LABELS } from '@/utils/projectLabels'
import api from '@/services/api'

const router = useRouter()
const swal = useSwal()

const columnDefs = [
  { field: 'name', headerName: 'Obra', flex: 1, filter: 'agTextColumnFilter' },
  {
    field: 'client.name',
    headerName: 'Cliente',
    flex: 1,
    valueGetter: (params) => params.data?.client?.name ?? '-',
    filter: 'agTextColumnFilter',
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 140,
    valueFormatter: (params) => PROJECT_STATUS_LABELS[params.value] ?? params.value,
  },
  {
    field: 'area_m2',
    headerName: 'Área (m²)',
    width: 120,
    valueFormatter: (params) => Number(params.value ?? 0).toFixed(2),
  },
  {
    field: 'progress_percent',
    headerName: 'Progresso',
    width: 110,
    valueFormatter: (params) => `${params.value ?? 0}%`,
  },
  {
    field: 'budget_summary.budget_total',
    headerName: 'Orçado',
    width: 140,
    valueGetter: (params) => params.data?.budget_summary?.budget_total ?? 0,
    valueFormatter: (params) => formatCurrency(params.value),
  },
  {
    field: 'budget_summary.expenses_total',
    headerName: 'Gasto',
    width: 140,
    valueGetter: (params) => params.data?.budget_summary?.expenses_total ?? 0,
    valueFormatter: (params) => formatCurrency(params.value),
  },
  {
    field: 'budget_summary.balance',
    headerName: 'Saldo',
    width: 140,
    valueGetter: (params) => params.data?.budget_summary?.balance ?? 0,
    valueFormatter: (params) => formatCurrency(params.value),
  },
]

const projects = ref([])
const selectedProjects = ref([])

const handleSelection = (selection) => {
  selectedProjects.value = selection
}

const fetchProjects = async () => {
  try {
    const { data } = await api.get('/projects')
    if (data?.success) {
      projects.value = data.data
    }
  } catch (err) {
    console.error('Failed to load projects:', err)
    swal.error('Erro', 'Não foi possível carregar as obras.')
  }
}

onMounted(fetchProjects)

const goToCreate = () => router.push('/projects/create')

const goToDetail = () => {
  if (selectedProjects.value.length === 1) {
    router.push(`/projects/${selectedProjects.value[0].id}`)
  }
}

const confirmArchive = async () => {
  if (selectedProjects.value.length === 0) return

  const confirmed = await swal.confirm(
    'Arquivar obra',
    `Deseja arquivar ${selectedProjects.value.length} obra(s)?`
  )

  if (!confirmed) return

  try {
    for (const project of selectedProjects.value) {
      await api.delete(`/projects/${project.id}`)
    }
    swal.success('Obra(s) arquivada(s) com sucesso!')
    selectedProjects.value = []
    await fetchProjects()
  } catch (err) {
    swal.error('Erro', 'Não foi possível arquivar a(s) obra(s).')
  }
}
</script>

<template>
  <div>
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div class="flex items-start flex-col gap-4">
        <div>
          <h1 class="text-2xl font-bold text-marble-900 tracking-tight">Obras</h1>
          <p class="mt-1 text-sm text-marble-600">
            Gerencie obras, orçamentos, materiais, gastos e progresso.
          </p>
        </div>
        <div class="mt-4 sm:mt-0 flex gap-2">
          <Button variant="primary" @click="goToCreate">
            <i class="fa-solid fa-plus mr-2"></i>
            Nova Obra
          </Button>
          <Button :disabled="selectedProjects.length !== 1" variant="success" @click="goToDetail">
            <i class="fa-solid fa-folder-open mr-2"></i>
            Abrir
          </Button>
          <Button :disabled="selectedProjects.length === 0" variant="danger" @click="confirmArchive">
            <i class="fa-solid fa-box-archive mr-2"></i>
            Arquivar
          </Button>
        </div>
      </div>
    </div>

    <div class="bg-white w-full rounded-xl shadow-sm ring-1 ring-marble-200 p-4">
      <Grid
        :rowData="projects"
        :columnDefs="columnDefs"
        :totalRows="projects.length"
        :currentPage="1"
        :pageSize="50"
        @update:selection="handleSelection"
      />
    </div>
  </div>
</template>
