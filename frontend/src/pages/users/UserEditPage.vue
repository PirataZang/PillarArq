<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Card from '@/components/utils/Card.vue'
import Input from '@/components/utils/Input.vue'
import Select from '@/components/utils/Select.vue'
import Button from '@/components/utils/Button.vue'

const router = useRouter()
const route = useRoute()

const form = reactive({
  name: '',
  email: '',
  role: '',
  status: 'Ativo'
})

const roles = ['Arquiteto', 'Engenheiro', 'Estagiário', 'Admin']
const statuses = ['Ativo', 'Inativo']

const loading = ref(false)
const fetching = ref(true)

onMounted(() => {
  // Simulate fetching data based on route.params.id
  setTimeout(() => {
    form.name = 'João Silva'
    form.email = 'joao@pillararq.com'
    form.role = 'Arquiteto'
    form.status = 'Ativo'
    fetching.value = false
  }, 500)
})

const handleSave = async () => {
  loading.value = true
  // Mock save API
  setTimeout(() => {
    loading.value = false
    router.push('/users')
  }, 1000)
}
</script>

<template>
  <div>
    <div class="mb-8 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button @click="router.back()" class="p-2 -ml-2 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors">
          <i class="fa-solid fa-arrow-left text-lg"></i>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Editar Usuário</h1>
          <p class="mt-1 text-sm text-gray-500">Atualize as informações do membro.</p>
        </div>
      </div>
    </div>

    <Card>
      <div v-if="fetching" class="flex justify-center p-8">
        <span class="text-gray-400">Carregando dados...</span>
      </div>
      <form v-else @submit.prevent="handleSave" class="space-y-6 max-w-2xl">
        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <Input
              v-model="form.name"
              label="Nome completo"
              placeholder="Digite o nome completo"
              required
            />
          </div>

          <div class="sm:col-span-2">
            <Input
              v-model="form.email"
              label="E-mail"
              type="email"
              placeholder="email@dominio.com"
              required
            />
          </div>

          <div class="sm:col-span-1">
            <Select
              v-model="form.role"
              label="Cargo"
              :options="roles"
              placeholder="Selecione um cargo"
              required
            />
          </div>

          <div class="sm:col-span-1">
            <Select
              v-model="form.status"
              label="Status"
              :options="statuses"
              required
            />
          </div>
        </div>

        <div class="pt-4 flex justify-end gap-3 border-t border-gray-100">
          <Button type="button" variant="ghost" @click="router.back()">
            Cancelar
          </Button>
          <Button type="submit" variant="primary" :loading="loading">
            <i class="fa-solid fa-floppy-disk mr-2"></i>
            Salvar Alterações
          </Button>
        </div>
      </form>
    </Card>
  </div>
</template>
