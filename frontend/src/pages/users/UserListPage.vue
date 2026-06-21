<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/utils/Button.vue'
import Grid from '@/components/utils/Grid.vue'
import { useSwal } from '@/utils/swal'

const router = useRouter()
const swal = useSwal()

const columnDefs = [
  { field: 'id', headerName: 'ID', width: 90, filter: 'agNumberColumnFilter' },
  { field: 'name', headerName: 'Nome', flex: 1, filter: 'agTextColumnFilter' },
  { field: 'email', headerName: 'Email', flex: 1, filter: 'agTextColumnFilter' },
  { field: 'active', headerName: 'Ativo', width: 120, valueFormatter: (params) => params.value ? 'Sim' : 'Não', filter: 'agSetColumnFilter', filterParams: { values: [true, false], valueFormatter: (params) => params.value ? 'Sim' : 'Não' } },
  { field: 'created_at', headerName: 'Cadastrado em', type: 'date', width: 180 }
]

const users = ref([
  {
    id: 13,
    name: "recrutamento",
    email: "recrutamento@rec.com",
    created_at: "2026-05-29T17:11:00.000000Z",
    updated_at: "2026-06-17T01:20:12.000000Z",
    token: "a71acfe9b7656e079551f8267fcd513be43c18f246c72bf422950b280c404d1d",
    active: true,
    token_expires_at: "2026-06-24T01:20:12.000000Z",
    company_id: 3,
    master: false
  }
])

const selectedUsers = ref([])

const handleSelection = (selection) => {
  selectedUsers.value = selection
}

const goToCreate = () => {
  router.push('/users/create')
}

const goToEdit = () => {
  if (selectedUsers.value.length === 1) {
    router.push(`/users/${selectedUsers.value[0].id}/edit`)
  }
}

const confirmDelete = async () => {
  if (selectedUsers.value.length === 0) return

  const confirm = await swal.confirm('Excluir Usuário', `Tem certeza que deseja excluir ${selectedUsers.value.length} usuário(s)?`)
  if (confirm) {
    const ids = selectedUsers.value.map(u => u.id)
    users.value = users.value.filter(u => !ids.includes(u.id))
    selectedUsers.value = []
    swal.success('Usuário(s) excluído(s) com sucesso!')
  }
}
</script>

<template>
  <div>
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Usuários</h1>
        <p class="mt-1 text-sm text-gray-500">Gerencie os usuários do escritório e suas permissões.</p>
      </div>
      <div class="mt-4 sm:mt-0 flex gap-2">
        <Button v-if="selectedUsers.length > 0" variant="ghost"
          class="text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200" @click="confirmDelete">
          <i class="fa-solid fa-trash mr-2"></i>
          Excluir Selecionados
        </Button>
        <Button v-if="selectedUsers.length === 1" variant="ghost" class="border border-gray-200" @click="goToEdit">
          <i class="fa-solid fa-pen mr-2"></i>
          Editar
        </Button>
        <Button variant="primary" @click="goToCreate">
          <i class="fa-solid fa-plus mr-2"></i>
          Novo Usuário
        </Button>
      </div>
    </div>

    <div class="bg-white w-full rounded-xl shadow-sm border-gray-200 p-4">
      <Grid :rowData="users" :columnDefs="columnDefs" :totalRows="users.length" :currentPage="1" :pageSize="50"
        @update:selection="handleSelection" />
    </div>
  </div>
</template>
