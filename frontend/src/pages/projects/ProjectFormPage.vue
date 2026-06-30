<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Card from '@/components/utils/Card.vue'
import Input from '@/components/utils/Input.vue'
import Textarea from '@/components/utils/Textarea.vue'
import Select from '@/components/utils/Select.vue'
import Button from '@/components/utils/Button.vue'
import FormLogsButton from '@/components/audit/FormLogsButton.vue'
import { useSwal } from '@/utils/swal'
import { PROJECT_STATUS_OPTIONS } from '@/utils/projectLabels'
import api from '@/services/api'

const router = useRouter()
const route = useRoute()
const swal = useSwal()

const isEdit = computed(() => route.name === 'projects.edit')
const loading = ref(false)
const fetching = ref(false)
const clients = ref([])

const form = reactive({
  client_id: '',
  name: '',
  description: '',
  address: '',
  area_m2: '',
  status: 'DRAFT',
  service_rate_override: '',
  extra_amount: '0',
  start_date: '',
  expected_end_date: '',
})

const toInputDate = (value) => (value ? String(value).slice(0, 10) : '')

const clientOptions = computed(() =>
  clients.value.map((client) => ({
    value: String(client.id),
    label: `${client.name} — ${client.service_rate_per_m2}/m²`,
  }))
)

const statusOptions = PROJECT_STATUS_OPTIONS.map((item) => ({
  value: item.value,
  label: item.label,
}))

const loadClients = async () => {
  const { data } = await api.get('/clients')
  if (data?.success) {
    clients.value = data.data.filter((client) => client.active !== false)
  }
}

const loadProject = async () => {
  const { data } = await api.get(`/projects/${route.params.id}`)
  if (!data?.success) return

  const project = data.data
  form.client_id = String(project.client_id)
  form.name = project.name
  form.description = project.description ?? ''
  form.address = project.address ?? ''
  form.area_m2 = String(project.area_m2 ?? '')
  form.status = project.status
  form.service_rate_override =
    project.service_rate_override !== null ? String(project.service_rate_override) : ''
  form.extra_amount = String(project.extra_amount ?? 0)
  form.start_date = toInputDate(project.start_date)
  form.expected_end_date = toInputDate(project.expected_end_date)
}

onMounted(async () => {
  fetching.value = true
  try {
    await loadClients()
    if (isEdit.value) {
      await loadProject()
    }
  } catch (err) {
    swal.error('Erro', 'Não foi possível carregar os dados da obra.')
    router.push('/projects')
  } finally {
    fetching.value = false
  }
})

const buildPayload = () => ({
  client_id: form.client_id,
  name: form.name,
  description: form.description || undefined,
  address: form.address || undefined,
  area_m2: Number(form.area_m2) || 0,
  status: form.status,
  service_rate_override: form.service_rate_override
    ? Number(form.service_rate_override)
    : null,
  extra_amount: Number(form.extra_amount) || 0,
  start_date: form.start_date || undefined,
  expected_end_date: form.expected_end_date || undefined,
})

const handleSave = async () => {
  loading.value = true
  try {
    const payload = buildPayload()

    if (isEdit.value) {
      await api.put(`/projects/${route.params.id}`, payload)
      swal.success('Sucesso', 'Obra atualizada com sucesso!')
      router.push(`/projects/${route.params.id}`)
    } else {
      const { data } = await api.post('/projects', payload)
      swal.success('Sucesso', 'Obra criada com sucesso!')
      router.push(`/projects/${data.data.id}`)
    }
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Não foi possível salvar a obra.'
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
        <button
          @click="router.back()"
          class="p-2 -ml-2 rounded-md text-marble-400 hover:text-marble-900 hover:bg-marble-100 transition-colors"
        >
          <i class="fa-solid fa-arrow-left text-lg"></i>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-marble-900 tracking-tight">
            {{ isEdit ? 'Editar Obra' : 'Nova Obra' }}
          </h1>
          <p class="mt-1 text-sm text-marble-600">
            Defina cliente, área e parâmetros iniciais da obra.
          </p>
        </div>
      </div>
      <FormLogsButton v-if="isEdit" subject-type="Project" :subject-id="route.params.id" />
    </div>

    <Card>
      <div v-if="fetching" class="flex justify-center p-8 text-marble-500">Carregando...</div>
      <form v-else @submit.prevent="handleSave" class="space-y-6">
        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <Select
              v-model="form.client_id"
              label="Cliente"
              :options="clientOptions"
              placeholder="Selecione o cliente"
              required
            />
          </div>
          <div class="sm:col-span-2">
            <Input v-model="form.name" label="Nome da obra" required />
          </div>
          <Input v-model="form.area_m2" label="Área (m²)" type="number" required />
          <Select v-model="form.status" label="Status" :options="statusOptions" required />
          <Input
            v-model="form.service_rate_override"
            label="Taxa de serviço personalizada (R$/m²)"
            type="number"
            helper-text="Deixe vazio para usar a taxa do cliente."
          />
          <Input v-model="form.extra_amount" label="Valor extra (R$)" type="number" />
          <Input v-model="form.start_date" label="Data de início" type="date" />
          <Input v-model="form.expected_end_date" label="Previsão de entrega" type="date" />
          <div class="sm:col-span-2">
            <Input v-model="form.address" label="Endereço da obra" />
          </div>
          <div class="sm:col-span-2">
            <Textarea v-model="form.description" label="Descrição" rows="3" />
          </div>
        </div>

        <div class="pt-4 flex justify-end gap-3 border-t border-marble-200">
          <Button type="button" variant="ghost" @click="router.back()">Cancelar</Button>
          <Button type="submit" variant="primary" :loading="loading">
            {{ isEdit ? 'Salvar alterações' : 'Criar obra' }}
          </Button>
        </div>
      </form>
    </Card>
  </div>
</template>
