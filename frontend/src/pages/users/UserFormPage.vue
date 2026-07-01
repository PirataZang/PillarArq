<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Card from '@/components/utils/Card.vue'
import Input from '@/components/utils/Input.vue'
import Select from '@/components/utils/Select.vue'
import Button from '@/components/utils/Button.vue'
import FormLogsButton from '@/components/audit/FormLogsButton.vue'
import Switch from '@/components/utils/Switch.vue'
import { useSwal } from '@/utils/swal'
import api from '@/services/api'

const router = useRouter()
const route = useRoute()
const swal = useSwal()

const isEdit = computed(() => !!route.params.id)
const activeTab = ref('general')

const form = reactive({
  name: '',
  email: '',
  isActive: true,
  password: '',
  permissions: {}
})

const loading = ref(false)
const fetching = ref(false)

onMounted(async () => {
  // 1. Carrega o esquema de permissões padrão
  try {
    const { data } = await api.get('/permissions')
    if (data && data.success) {
      form.permissions = JSON.parse(JSON.stringify(data.data))
    }
  } catch (err) {
    console.error('Erro ao carregar permissões padrão:', err)
  }

  // 2. Se for edição, carrega os dados do usuário
  if (isEdit.value) {
    fetching.value = true
    try {
      const { data } = await api.get(`/users/${route.params.id}`)
      if (data && data.success) {
        form.name = data.data.name
        form.email = data.data.email
        form.isActive = !!data.data.active

        if (data.data.permissions) {
          const userPerms = data.data.permissions
          for (const moduleKey of Object.keys(userPerms)) {
            if (form.permissions[moduleKey]) {
              const actionsObj = userPerms[moduleKey].actions || userPerms[moduleKey]
              if (actionsObj && form.permissions[moduleKey].actions) {
                for (const actionKey of Object.keys(actionsObj)) {
                  if (form.permissions[moduleKey].actions[actionKey]) {
                    const val = typeof actionsObj[actionKey] === 'object'
                      ? actionsObj[actionKey].value
                      : actionsObj[actionKey]
                    form.permissions[moduleKey].actions[actionKey].value = val === true
                  }
                }
              }
            }
          }
        }
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

const isAllSelectedInModule = (moduleKey) => {
  const moduleData = form.permissions[moduleKey]
  if (!moduleData || !moduleData.actions) return false
  return Object.values(moduleData.actions).every(action => action.value === true)
}

const toggleAllInModule = (moduleKey) => {
  const moduleData = form.permissions[moduleKey]
  if (!moduleData || !moduleData.actions) return
  const allSelected = isAllSelectedInModule(moduleKey)
  Object.keys(moduleData.actions).forEach(actionKey => {
    moduleData.actions[actionKey].value = !allSelected
  })
}

const handleSave = async () => {
  loading.value = true
  try {
    const payload = {
      name: form.name,
      email: form.email,
      is_active: form.isActive,
      permissions: form.permissions
    }

    if (isEdit.value) {
      await api.put(`/users/${route.params.id}`, payload)
      swal.success('Sucesso', 'Usuário atualizado com sucesso!')
    } else {
      payload.password = form.password
      await api.post('/users', payload)
      swal.success('Sucesso', 'Usuário cadastrado com sucesso!')
    }
    router.push('/users')
  } catch (err) {
    console.error('Erro ao salvar usuário:', err)
    let errorMsg = 'Ocorreu um erro ao salvar as informações.'
    if (err.response?.data) {
      const data = err.response.data
      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0 && typeof data.errors[0] === 'object') {
        errorMsg = data.errors.map((e) => e.message).join('\n')
      } else {
        errorMsg = data.message || errorMsg
      }
    }
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
            {{ isEdit ? 'Preencha os dados do sistema e permissões de acesso.' : 'Cadastre um novo membro na plataforma.' }}
          </p>
        </div>
      </div>
      <FormLogsButton v-if="isEdit" class="shrink-0" subject-type="User" :subject-id="route.params.id" />
    </div>

    <!-- Navegação de Abas -->
    <div class="flex gap-2 mb-6 border-b border-gray-100 pb-3">
      <button type="button" @click="activeTab = 'general'" :class="[
        activeTab === 'general'
          ? 'bg-charcoal text-white shadow-sm'
          : 'bg-white text-marble-700 hover:bg-marble-50 border border-marble-300'
      ]" class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer">
        <i class="fa-solid fa-address-card"></i>
        Dados Gerais
      </button>
      <button type="button" @click="activeTab = 'permissions'" :class="[
        activeTab === 'permissions'
          ? 'bg-charcoal text-white shadow-sm'
          : 'bg-white text-marble-700 hover:bg-marble-50 border border-marble-300'
      ]" class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer">
        <i class="fa-solid fa-shield-halved"></i>
        Permissões de Acesso
      </button>
      <button type="button" @click="activeTab = 'notifications'" :class="[
        activeTab === 'notifications'
          ? 'bg-charcoal text-white shadow-sm'
          : 'bg-white text-marble-700 hover:bg-marble-50 border border-marble-300'
      ]" class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer">
        <i class="fa-solid fa-bell"></i>
        Notificações
      </button>
    </div>

    <Card>
      <div v-if="fetching" class="flex justify-center p-8">
        <span class="text-gray-400">Carregando dados...</span>
      </div>

      <form v-else @submit.prevent="handleSave" class="space-y-6 w-full">
        <!-- Aba Dados Gerais -->
        <div v-show="activeTab === 'general'" class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <Input v-model="form.name" label="Nome completo" placeholder="Digite o nome completo" required />
          </div>

          <div class="sm:col-span-2">
            <Input v-model="form.email" label="E-mail" type="email" placeholder="email@dominio.com" required
              autocomplete="new-email" />
          </div>

          <!-- Campo de Senha - Exibido apenas em Modo Criação -->
          <div v-if="!isEdit" class="sm:col-span-2">
            <Input v-model="form.password" label="Senha" type="password"
              placeholder="Digite uma senha (mínimo 6 caracteres)" required autocomplete="new-password" />
          </div>

          <!-- Status - Switch Ativo/Inativo -->
          <div class="sm:col-span-2 flex items-center justify-between bg-white rounded-xl border border-gray-100 p-4">
            <div class="flex flex-col">
              <span class="text-sm font-semibold text-gray-900">Status da Conta</span>
              <span class="text-xs text-gray-500 mt-0.5">Determine se o usuário pode acessar a plataforma.</span>
            </div>
            <div>
              <Switch v-model="form.isActive" :label="form.isActive ? 'Ativo' : 'Inativo'" />
            </div>
          </div>
        </div>

        <!-- Aba Permissões de Acesso -->
        <div v-show="activeTab === 'permissions'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="(moduleData, moduleKey) in form.permissions" :key="moduleKey"
            class="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col">

            <!-- Card Header -->
            <div class="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div class="flex items-center gap-2.5">
                <span class="w-8 h-8 rounded-lg bg-marble-100 text-marble-700 flex items-center justify-center border border-marble-200">
                  <i :class="moduleData.icon || 'fa-solid fa-gear'"></i>
                </span>
                <h3 class="font-bold text-gray-900">
                  {{ moduleData.title || moduleKey }}
                </h3>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500 font-medium">Todos</span>
                <Switch :modelValue="isAllSelectedInModule(moduleKey)"
                  @update:modelValue="toggleAllInModule(moduleKey)" />
              </div>
            </div>

            <!-- Card Body / Actions List -->
            <div class="space-y-4 flex-1">
              <div v-for="(actionData, actionKey) in moduleData.actions" :key="actionKey"
                class="flex items-center justify-between py-2 border-b border-gray-50 last:border-b-0">
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-gray-900">
                    {{ actionData.title || actionKey }}
                  </span>
                  <span class="text-xs text-gray-500 mt-0.5">
                    {{ actionData.desc || '' }}
                  </span>
                </div>
                <div>
                  <Switch v-model="actionData.value" />
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Aba Notificações (Placeholder) -->
        <div v-show="activeTab === 'notifications'" class="py-8 text-center">
          <div class="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fa-solid fa-bell-slash text-2xl"></i>
          </div>
          <h3 class="text-base font-semibold text-gray-900">Configurações de Notificações</h3>
          <p class="text-sm text-gray-500 mt-1">Este usuário não possui nenhuma configuração de notificação ativa no
            momento.</p>
        </div>

        <!-- Footer Buttons -->
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
