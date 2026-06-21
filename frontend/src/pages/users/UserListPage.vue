<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/utils/Button.vue'

const router = useRouter()

const columns = [
  { key: 'name', label: 'Nome', sortable: true },
  { key: 'email', label: 'E-mail', sortable: true },
  { key: 'role', label: 'Cargo', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: '', class: 'w-20' }
]

const loading = ref(false)
const users = ref([
  // Mock Data
  { id: 1, name: 'João Silva', email: 'joao@pillararq.com', role: 'Arquiteto', status: 'Ativo' },
  { id: 2, name: 'Maria Souza', email: 'maria@pillararq.com', role: 'Engenheira', status: 'Ativo' },
  { id: 3, name: 'Pedro Costa', email: 'pedro@pillararq.com', role: 'Estagiário', status: 'Inativo' },
])

const isDeleteModalOpen = ref(false)
const userToDelete = ref(null)

const openDeleteModal = (user) => {
  userToDelete.value = user
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  // Chamada de API para deletar
  isDeleteModalOpen.value = false
  users.value = users.value.filter(u => u.id !== userToDelete.value.id)
  userToDelete.value = null
}

const goToCreate = () => {
  router.push('/users/create')
}

const goToEdit = (user) => {
  router.push(`/users/${user.id}/edit`)
}
</script>

<template>
  <div>
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Usuários</h1>
        <p class="mt-1 text-sm text-gray-500">Gerencie os usuários do escritório e suas permissões.</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <Button variant="primary" @click="goToCreate">
          <i class="fa-solid fa-plus mr-2"></i>
          Novo Usuário
        </Button>
      </div>
    </div>

    <Table :columns="columns" :data="users" :loading="loading" :show-pagination="true" :total-items="3" :total-pages="1"
      :current-page="1">
      <template #cell(status)="{ value }">
        <span :class="[
          value === 'Ativo' ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-gray-50 text-gray-600 ring-gray-500/10',
          'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset'
        ]">
          {{ value }}
        </span>
      </template>

      <template #cell(actions)="{ row }">
        <div class="flex gap-2">
          <Button variant="ghost" size="sm" @click="goToEdit(row.id)">
            <i class="fa-solid fa-pen text-gray-500"></i>
          </Button>
          <Button variant="ghost" size="sm" class="text-red-600 hover:text-red-700 hover:bg-red-50" @click="openDeleteModal(row)">
            <i class="fa-solid fa-trash text-red-500"></i>
          </Button>
        </div>
      </template>
    </Table>

    <ConfirmDialog v-model:open="isDeleteModalOpen" title="Excluir Usuário"
      :message="`Tem certeza que deseja excluir o usuário ${userToDelete?.name}? Esta ação não poderá ser desfeita.`"
      type="danger" @confirm="confirmDelete" />
  </div>
</template>
