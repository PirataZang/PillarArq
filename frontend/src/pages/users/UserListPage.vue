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
  { field: 'email', headerName: 'Email', flex: 1, filter: 'agTextColumnFilter' },
  { field: 'active', headerName: 'Ativo', width: 120, valueFormatter: (params) => params.value ? 'Sim' : 'Não', filter: 'agTextColumnFilter', filterValueGetter: (params) => (params.data?.active ? 'Sim' : 'Não') },
  { field: 'created_at', headerName: 'Cadastrado em', type: 'date', width: 180 }
]

const users = ref([])
const selectedUsers = ref([])

const handleSelection = (selection) => {
  selectedUsers.value = selection
}

const fetchUsers = async () => {
  try {
    const { data } = await api.get('/users')
    if (data && data.success) {
      users.value = data.data
    }
  } catch (err) {
    console.error('Erro ao buscar usuários:', err)
    swal.error('Erro', 'Não foi possível carregar a lista de usuários.')
  }
}

onMounted(async () => {
  await fetchUsers()
})

const goToCreate = () => {
  router.push('/users/create')
}

const goToEdit = () => {
  if (selectedUsers.value.length === 1) {
    router.push(`/users/${selectedUsers.value[0].id}`)
  }
}

const confirmDelete = async () => {
  if (selectedUsers.value.length === 0) return

  const confirm = await swal.confirm('Excluir Usuário', `Tem certeza que deseja excluir ${selectedUsers.value.length} usuário(s)?`)
  if (confirm) {
    try {
      for (const user of selectedUsers.value) {
        await api.delete(`/users/${user.id}`)
      }
      swal.success('Usuário(s) excluído(s) com sucesso!')
      selectedUsers.value = []
      await fetchUsers()
    } catch (err) {
      console.error('Erro ao excluir usuário:', err)
      swal.error('Erro', 'Ocorreu um erro ao excluir o(s) usuário(s).')
    }
  }
}
</script>

<template>
  <div>
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div class="flex items-start flex-col gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Usuários</h1>
          <p class="mt-1 text-sm text-gray-500">Gerencie os usuários do escritório e suas permissões.</p>
        </div>
        <div class="mt-4 sm:mt-0 flex gap-2">
          <Button variant="primary" @click="goToCreate">
            <i class="fa-solid fa-plus mr-2"></i>
            Novo Usuário
          </Button>
          <Button :disabled="selectedUsers.length !== 1" variant="success" @click="goToEdit">
            <i class="fa-solid fa-pen mr-2"></i>
            Editar
          </Button>
          <Button :disabled="selectedUsers.length === 0" variant="danger" @click="confirmDelete">
            <i class="fa-solid fa-trash mr-2"></i>
            Excluir Selecionados
          </Button>
        </div>
      </div>
    </div>

    <div class="bg-white w-full rounded-xl shadow-sm ring-1 ring-marble-200 p-4">
      <Grid :rowData="users" :columnDefs="columnDefs" :totalRows="users.length" :currentPage="1" :pageSize="50"
        @update:selection="handleSelection" />
    </div>
  </div>
</template>
