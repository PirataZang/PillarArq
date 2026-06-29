<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/utils/Button.vue'
import Grid from '@/components/utils/Grid.vue'
import { useSwal } from '@/utils/swal'
import { downloadDocumentPdf } from '@/utils/documentPdf'
import api from '@/services/api'

const router = useRouter()
const swal = useSwal()

const templates = ref([])
const clients = ref([])
const selected = ref([])
const downloading = ref(false)

const columnDefs = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Nome', flex: 1 },
  {
    field: 'document_type',
    headerName: 'Tipo',
    width: 130,
    valueFormatter: (p) => (p.value === 'ORCAMENTO' ? 'Orçamento' : 'Geral'),
  },
  {
    field: 'client_name',
    headerName: 'Cliente',
    flex: 1,
    valueFormatter: (p) => p.value || 'Geral',
  },
  {
    field: 'updated_at',
    headerName: 'Atualizado em',
    width: 180,
    valueFormatter: (p) => (p.value ? new Date(p.value).toLocaleString('pt-BR') : '—'),
  },
]

const fetchTemplates = async () => {
  try {
    const { data } = await api.get('/document-templates')
    if (data?.success) templates.value = data.data
  } catch {
    swal.error('Erro', 'Não foi possível carregar os templates.')
  }
}

const fetchClients = async () => {
  try {
    const { data } = await api.get('/clients')
    if (data?.success) clients.value = data.data
  } catch {
    /* optional */
  }
}

onMounted(() => {
  fetchTemplates()
  fetchClients()
})

const goToCreate = () => router.push('/documents/create')

const goToEdit = () => {
  if (selected.value.length === 1) {
    router.push(`/documents/${selected.value[0].id}/edit`)
  }
}

const downloadSelected = async () => {
  if (selected.value.length !== 1) return
  const item = selected.value[0]

  downloading.value = true
  try {
    await downloadDocumentPdf({
      templateId: item.id,
      name: item.name,
      clientId: item.client_id || undefined,
    })
    swal.success('PDF baixado com sucesso!')
  } catch {
    swal.error('Erro', 'Não foi possível gerar o PDF.')
  } finally {
    downloading.value = false
  }
}

const confirmDelete = async () => {
  if (!selected.value.length) return
  const confirmed = await swal.confirm(
    'Excluir template',
    `Deseja excluir ${selected.value.length} template(s)?`
  )
  if (!confirmed) return

  try {
    for (const item of selected.value) {
      await api.delete(`/document-templates/${item.id}`)
    }
    selected.value = []
    await fetchTemplates()
    swal.success('Template(s) excluído(s).')
  } catch {
    swal.error('Erro', 'Não foi possível excluir o(s) template(s).')
  }
}
</script>

<template>
  <div>
    <div class="mb-8 sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-marble-900">Templates de Documentos</h1>
        <p class="mt-1 text-sm text-marble-600">
          Crie documentos customizados por cliente com blocos, formatação e variáveis dinâmicas.
        </p>
      </div>
      <div class="mt-4 flex gap-2 sm:mt-0">
        <Button variant="secondary" :disabled="selected.length !== 1" @click="goToEdit">
          Editar
        </Button>
        <Button
          variant="secondary"
          :disabled="selected.length !== 1 || downloading"
          @click="downloadSelected"
        >
          Baixar PDF
        </Button>
        <Button variant="danger" :disabled="!selected.length" @click="confirmDelete">
          Excluir
        </Button>
        <Button variant="primary" @click="goToCreate">Novo Template</Button>
      </div>
    </div>

    <Grid
      :row-data="templates"
      :column-defs="columnDefs"
      @update:selection="selected = $event"
    />
  </div>
</template>
