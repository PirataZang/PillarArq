<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/utils/Button.vue'
import Grid from '@/components/utils/Grid.vue'
import { useSwal } from '@/utils/swal'
import api from '@/services/api'

const router = useRouter()
const swal = useSwal()

const columnDefs = [
  { field: 'id', headerName: 'ID', width: 90, filter: 'agNumberColumnFilter' },
  { field: 'name', headerName: 'Nome', flex: 1, filter: 'agTextColumnFilter' },
  { field: 'slug', headerName: 'Slug/Identificador', flex: 1, filter: 'agTextColumnFilter' },
  { field: 'isActive', headerName: 'Ativo', width: 120, valueFormatter: (params) => params.value ? 'Sim' : 'Não', filter: 'agTextColumnFilter', filterValueGetter: (params) => (params.data?.isActive ? 'Sim' : 'Não') },
  { field: 'createdAt', headerName: 'Cadastrado em', type: 'date', width: 180 }
]

const companies = ref([])
const selectedCompanies = ref([])

const handleSelection = (selection) => {
  selectedCompanies.value = selection
}

const fetchCompanies = async () => {
  try {
    const { data } = await api.get('/companies')
    if (data && data.success) {
      companies.value = data.data
    }
  } catch (err) {
    console.error('Erro ao buscar empresas:', err)
    swal.error('Erro', 'Não foi possível carregar a lista de empresas.')
  }
}

onMounted(async () => {
  await fetchCompanies()
})

const goToCreate = () => {
  router.push('/companies/create')
}

const goToEdit = () => {
  if (selectedCompanies.value.length === 1) {
    router.push(`/companies/${selectedCompanies.value[0].id}`)
  }
}

const confirmDelete = async () => {
  if (selectedCompanies.value.length === 0) return

  const confirm = await swal.confirm('Excluir Empresa', `Tem certeza que deseja excluir ${selectedCompanies.value.length} empresa(s)?`)
  if (confirm) {
    try {
      for (const comp of selectedCompanies.value) {
        await api.delete(`/companies/${comp.id}`)
      }
      swal.success('Empresa(s) excluída(s) com sucesso!')
      selectedCompanies.value = []
      await fetchCompanies()
    } catch (err) {
      console.error('Erro ao excluir empresa:', err)
      swal.error('Erro', 'Ocorreu um erro ao excluir a(s) empresa(s).')
    }
  }
}
</script>

<template>
  <div>
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div class="flex items-start flex-col gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Empresas (Tenants)</h1>
          <p class="mt-1 text-sm text-gray-500">Gerencie as empresas e escritórios de arquitetura/engenharia cadastrados no sistema.</p>
        </div>
        <div class="mt-4 sm:mt-0 flex gap-2">
          <Button variant="primary" @click="goToCreate">
            <i class="fa-solid fa-plus mr-2"></i>
            Nova Empresa
          </Button>
          <Button :disabled="selectedCompanies.length !== 1" variant="success" @click="goToEdit">
            <i class="fa-solid fa-pen mr-2"></i>
            Editar
          </Button>
          <Button :disabled="selectedCompanies.length === 0" variant="danger" @click="confirmDelete">
            <i class="fa-solid fa-trash mr-2"></i>
            Excluir Selecionadas
          </Button>
        </div>
      </div>
    </div>

    <div class="bg-white w-full rounded-xl shadow-sm ring-1 ring-marble-200 p-4">
      <Grid :rowData="companies" :columnDefs="columnDefs" :totalRows="companies.length" :currentPage="1" :pageSize="50"
        @update:selection="handleSelection" />
    </div>
  </div>
</template>
