<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import Card from '@/components/utils/Card.vue'
import Input from '@/components/utils/Input.vue'
import Select from '@/components/utils/Select.vue'
import Button from '@/components/utils/Button.vue'

const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  role: '',
  status: 'Ativo'
})

const roles = ['Arquiteto', 'Engenheiro', 'Estagiário', 'Admin']
const statuses = ['Ativo', 'Inativo']

const loading = ref(false)

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
        <Button variant="ghost" class="mb-4 text-gray-500 hover:text-gray-900" @click="router.back()">
          <i class="fa-solid fa-arrow-left mr-2"></i>
          Voltar
        </Button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Novo Usuário</h1>
          <p class="mt-1 text-sm text-gray-500">Cadastre um novo membro na plataforma.</p>
        </div>
      </div>
    </div>

    <Card>
      <form @submit.prevent="handleSave" class="space-y-6 max-w-2xl">
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
            Salvar Usuário
          </Button>
        </div>
      </form>
    </Card>
  </div>
</template>
