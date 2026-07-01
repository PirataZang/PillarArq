<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/utils/Button.vue'
import { useSwal } from '@/utils/swal'
import api from '@/services/api'

const router = useRouter()
const swal = useSwal()

const search = ref('')
const searchDebounced = ref('')
const projects = ref([])
const phaseTemplates = ref([])
const loading = ref(false)
const draggedProjectId = ref(null)

let searchTimeout = null

const kanbanColumns = computed(() =>
  phaseTemplates.value.map((template) => ({
    ...template,
    projects: projects.value.filter((project) => currentPhase(project)?.name === template.name),
  }))
)

function formatDate(value) {
  if (!value) return '—'
  const [year, month, day] = String(value).split('-')
  if (!year || !month || !day) return value
  return `${day}/${month}/${year}`
}

const statusColor = (status) => status.color || '#5c5852'

const hexToRgba = (hex, opacity) => {
  const value = hex.replace('#', '')
  const red = parseInt(value.slice(0, 2), 16)
  const green = parseInt(value.slice(2, 4), 16)
  const blue = parseInt(value.slice(4, 6), 16)
  return `rgba(${red}, ${green}, ${blue}, ${opacity})`
}

const fetchProjects = async () => {
  loading.value = true
  try {
    const params = { archived: false }
    if (searchDebounced.value.trim()) {
      params.search = searchDebounced.value.trim()
    }

    const { data } = await api.get('/projects', { params })
    if (data?.success) {
      projects.value = data.data
    }
  } catch (err) {
    console.error('Failed to load projects:', err)
    swal.error('Erro', 'Não foi possível carregar as obras.')
  } finally {
    loading.value = false
  }
}

const fetchPhaseTemplates = async () => {
  try {
    const { data } = await api.get('/settings/phase-templates')
    if (data?.success) {
      phaseTemplates.value = data.data.templates
    }
  } catch (err) {
    console.error('Failed to load phase templates:', err)
  }
}

onMounted(() => {
  fetchPhaseTemplates()
  fetchProjects()
})

watch(search, (value) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    searchDebounced.value = value
    fetchProjects()
  }, 350)
})

const openProject = (project) => {
  if (project?.id) {
    router.push(`/projects/${project.id}`)
  }
}

const currentPhase = (project) => {
  const phases = project.phases ?? []
  return phases
    .filter((phase) => phase.is_completed)
    .sort((a, b) => Number(b.sort_order) - Number(a.sort_order))[0] ?? phases[0]
}

const phaseForTemplate = (project, template) => {
  return project.phases?.find((phase) => phase.name === template.name)
}

const handleDragStart = (project, event) => {
  draggedProjectId.value = project.id
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', String(project.id))
}

const handleDrop = async (template) => {
  const project = projects.value.find((item) => item.id === draggedProjectId.value)
  const targetPhase = project ? phaseForTemplate(project, template) : null

  if (!project || !targetPhase || currentPhase(project)?.id === targetPhase.id) {
    draggedProjectId.value = null
    return
  }

  loading.value = true
  try {
    await api.patch(
      `/projects/${project.id}/phases/${targetPhase.id}`,
      { is_completed: true },
      { loading: false }
    )
    await fetchProjects()
  } catch (err) {
    swal.error('Erro', 'Não foi possível atualizar o status da obra.')
  } finally {
    draggedProjectId.value = null
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-[calc(100vh-112px)] flex-col">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
      <div>
        <h1 class="text-2xl font-bold text-marble-900 tracking-tight">Projetos (Kanban)</h1>
        <p class="mt-1 text-sm text-marble-600">
          Acompanhe obras ativas pelo status de progresso configurado.
        </p>
      </div>
      <Button variant="primary" @click="router.push('/projects/create')">
        <i class="fa-solid fa-plus mr-2"></i>
        Nova Obra
      </Button>
    </div>

    <div class="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
      <p class="text-sm text-marble-600 shrink-0">
        <span class="font-semibold text-marble-900">{{ projects.length }}</span>
        obra(s) ativa(s)
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
    </div>

    <div class="flex-1 overflow-x-auto pb-2" :class="{ 'opacity-60 pointer-events-none': loading }">
      <div v-if="kanbanColumns.length === 0"
        class="rounded-xl border border-dashed border-marble-300 bg-white p-8 text-center text-sm text-marble-500">
        Nenhum status configurado para montar o Kanban.
      </div>

      <div v-else class="flex h-full min-h-[calc(100vh-250px)] w-full gap-4">
        <section v-for="column in kanbanColumns" :key="column.id"
          class="flex min-w-72 flex-1 flex-col rounded-xl ring-1 ring-marble-200"
          :style="{
            borderTop: `4px solid ${statusColor(column)}`,
            backgroundColor: hexToRgba(statusColor(column), 0.06),
          }"
          @dragover.prevent @drop.prevent="handleDrop(column)">
          <header class="border-b border-marble-200 px-4 py-3">
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0 flex items-center gap-2">
                <span class="h-2.5 w-2.5 rounded-full shrink-0" :style="{ backgroundColor: statusColor(column) }"></span>
                <div class="min-w-0">
                  <h2 class="truncate text-sm font-semibold text-marble-900">{{ column.name }}</h2>
                  <p class="text-[11px] text-marble-500">{{ column.weight_percent }}%</p>
                </div>
              </div>
              <span
                class="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-xs font-medium text-marble-600 ring-1 ring-marble-200">
                {{ column.projects.length }}
              </span>
            </div>
          </header>

          <div class="flex-1 space-y-3 overflow-y-auto p-3">
            <button v-for="project in column.projects" :key="project.id" type="button" draggable="true"
              class="w-full cursor-grab rounded-lg border border-l-4 border-marble-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-marble-300 hover:shadow-md active:cursor-grabbing"
              :style="{ borderLeftColor: statusColor(column) }"
              @dragstart="handleDragStart(project, $event)" @dragend="draggedProjectId = null"
              @click="openProject(project)">
              <span class="text-[11px] font-semibold uppercase tracking-wide" :style="{ color: statusColor(column) }">
                {{ project.progress_percent }}% concluído
              </span>
              <h3 class="mt-1 line-clamp-2 text-sm font-semibold text-marble-900">{{ project.name }}</h3>
              <p class="mt-2 truncate text-xs text-marble-500">{{ project.client?.name }}</p>
              <div class="mt-3 flex items-center justify-between gap-2 text-[11px] text-marble-400">
                <span>{{ formatDate(project.expected_end_date) }}</span>
                <i class="fa-solid fa-grip-vertical"></i>
              </div>
            </button>

            <p v-if="column.projects.length === 0"
              class="rounded-lg border border-dashed border-marble-200 px-3 py-6 text-center text-xs text-marble-400">
              Sem obras neste status
            </p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
