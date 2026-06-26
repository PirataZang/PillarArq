<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/utils/Button.vue'
import Grid from '@/components/utils/Grid.vue'
import { useSwal } from '@/utils/swal'
import { formatCurrency } from '@/utils/currency'
import api from '@/services/api'

const router = useRouter()
const swal = useSwal()

const columnDefs = [
  { field: 'id', headerName: 'ID', width: 90, filter: 'agNumberColumnFilter' },
  { field: 'name', headerName: 'Nome', flex: 1, filter: 'agTextColumnFilter' },
  { field: 'email', headerName: 'E-mail', flex: 1, filter: 'agTextColumnFilter' },
  {
    field: 'service_rate_per_m2',
    headerName: 'Serviço (R$/m²)',
    width: 160,
    valueFormatter: (params) => formatCurrency(params.value),
  },
  {
    field: 'active',
    headerName: 'Ativo',
    width: 100,
    valueFormatter: (params) => (params.value ? 'Sim' : 'Não'),
  },
]

const clients = ref([])
const selectedClients = ref([])

const handleSelection = (selection) => {
  selectedClients.value = selection
}

const fetchClients = async () => {
  try {
    const { data } = await api.get('/clients')
    if (data?.success) {
      clients.value = data.data
    }
  } catch (err) {
    console.error('Failed to load clients:', err)
    swal.error('Erro', 'Não foi possível carregar a lista de clientes.')
  }
}

onMounted(fetchClients)

const goToCreate = () => router.push('/clients/create')

const goToEdit = () => {
  if (selectedClients.value.length === 1) {
    router.push(`/clients/${selectedClients.value[0].id}`)
  }
}

const confirmDelete = async () => {
  if (selectedClients.value.length === 0) return

  const confirmed = await swal.confirm(
    'Desativar cliente',
    `Deseja desativar ${selectedClients.value.length} cliente(s)?`
  )

  if (!confirmed) return

  try {
    for (const client of selectedClients.value) {
      await api.delete(`/clients/${client.id}`)
    }
    swal.success('Cliente(s) desativado(s) com sucesso!')
    selectedClients.value = []
    await fetchClients()
  } catch (err) {
    console.error('Failed to delete clients:', err)
    swal.error('Erro', 'Não foi possível desativar o(s) cliente(s).')
  }
}
</script>

<template>
  <div>
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div class="flex items-start flex-col gap-4">
        <div>
          <h1 class="text-2xl font-bold text-marble-900 tracking-tight">Clientes</h1>
          <p class="mt-1 text-sm text-marble-600">
            Cadastre clientes e defina o valor de serviço por metro quadrado.
          </p>
        </div>
        <div class="mt-4 sm:mt-0 flex gap-2">
          <Button variant="primary" @click="goToCreate">
            <i class="fa-solid fa-plus mr-2"></i>
            Novo Cliente
          </Button>
          <Button :disabled="selectedClients.length !== 1" variant="success" @click="goToEdit">
            <i class="fa-solid fa-pen mr-2"></i>
            Editar
          </Button>
          <Button :disabled="selectedClients.length === 0" variant="danger" @click="confirmDelete">
            <i class="fa-solid fa-trash mr-2"></i>
            Desativar
          </Button>
        </div>
      </div>
    </div>

    <div class="bg-white w-full rounded-xl shadow-sm ring-1 ring-marble-200 p-4">
      <Grid
        :rowData="clients"
        :columnDefs="columnDefs"
        :totalRows="clients.length"
        :currentPage="1"
        :pageSize="50"
        @update:selection="handleSelection"
      />
    </div>
  </div>
</template>
