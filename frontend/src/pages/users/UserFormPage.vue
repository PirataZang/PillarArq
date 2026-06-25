<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Card from '@/components/utils/Card.vue'
import Input from '@/components/utils/Input.vue'
import Select from '@/components/utils/Select.vue'
import Button from '@/components/utils/Button.vue'
import { useSwal } from '@/utils/swal'
import api from '@/services/api'

const router = useRouter()
const route = useRoute()
const swal = useSwal()

const isEdit = computed(() => !!route.params.id)

const form = reactive({
  name: '',
  email: '',
  role: '',
  status: 'Ativo',
  password: ''
})

const roles = ['Arquiteto', 'Engenheiro', 'Estagiário', 'Admin']
const statuses = ['Ativo', 'Inativo']

const loading = ref(false)
const fetching = ref(false)

onMounted(async () => {
  if (isEdit.value) {
    fetching.value = true
    try {
      const { data } = await api.get(`/users/${route.params.id}`)
      if (data && data.success) {
        form.name = data.data.name
        form.email = data.data.email
        form.role = data.data.role
        form.status = data.data.active ? 'Ativo' : 'Inativo'
      }
    } catch (err) {
      console.error('Erro ao carregar usuário:', err)
      swal.error('Erro', 'Não foi possível carregar as informações deste usuário ou você não tem permissão para visualizá-lo.')
      router.push('/users')
    } finally {
      fetching.value = false
    }
  }
})

const handleSave = async () => {
  loading.value = true
  try {
    const payload = {
      name: form.name,
      email: form.email,
      role: form.role,
      is_active: form.status === 'Ativo'
    }

    if (isEdit.value) {
      // Se for edição, chama PUT
      await api.put(`/users/${route.params.id}`, payload)
      swal.success('Sucesso', 'Usuário atualizado com sucesso!')
    } else {
      // Se for criação, inclui a senha e chama POST
      payload.password = form.password
      await api.post('/users', payload)
      swal.success('Sucesso', 'Usuário cadastrado com sucesso!')
    }
    router.push('/users')
  } catch (err) {
    console.error('Erro ao salvar usuário:', err)
    const errorMsg = err.response?.data?.message || 'Ocorreu um erro ao salvar as informações.'
    swal.error('Erro', errorMsg)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-8 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button @click="router.back()"
          class="p-2 -ml-2 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors">
          <i class="fa-solid fa-arrow-left text-lg"></i>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
            {{ isEdit ? 'Editar Usuário' : 'Novo Usuário' }}
          </h1>
          <p class="mt-1 text-sm text-gray-500">
            {{ isEdit ? 'Atualize as informações do membro.' : 'Cadastre um novo membro na plataforma.' }}
          </p>
        </div>
      </div>
    </div>

    <Card>
      <div v-if="fetching" class="flex justify-center p-8">
        <span class="text-gray-400">Carregando dados...</span>
      </div>
      <form v-else @submit.prevent="handleSave" class="space-y-6 w-full">
        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <Input v-model="form.name" label="Nome completo" placeholder="Digite o nome completo" required />
          </div>

          <div class="sm:col-span-2">
            <Input v-model="form.email" label="E-mail" type="email" placeholder="email@dominio.com" required />
          </div>

          <!-- Campo de Senha - Exibido apenas em Modo Criação -->
          <div v-if="!isEdit" class="sm:col-span-2">
            <Input v-model="form.password" label="Senha" type="password" placeholder="Digite uma senha (mínimo 6 caracteres)" required />
          </div>

          <div class="sm:col-span-1">
            <Select v-model="form.role" label="Cargo" :options="roles" placeholder="Selecione um cargo" required />
          </div>

          <div class="sm:col-span-1">
            <Select v-model="form.status" label="Status" :options="statuses" required />
          </div>
        </div>

        <div class="pt-4 flex justify-end gap-3 border-t border-gray-100">
          <Button type="button" variant="ghost" @click="router.back()">
            Cancelar
          </Button>
          <Button type="submit" variant="primary" :loading="loading">
            <i class="fa-solid fa-floppy-disk mr-2"></i>
            {{ isEdit ? 'Salvar Alterações' : 'Salvar Usuário' }}
          </Button>
        </div>
      </form>
    </Card>
  </div>
</template>
