<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Card from '@/components/utils/Card.vue'
import Input from '@/components/utils/Input.vue'
import Textarea from '@/components/utils/Textarea.vue'
import Select from '@/components/utils/Select.vue'
import Button from '@/components/utils/Button.vue'
import { useSwal } from '@/utils/swal'
import api from '@/services/api'

const router = useRouter()
const route = useRoute()
const swal = useSwal()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)
const fetching = ref(false)

const form = reactive({
  name: '',
  email: '',
  phone: '',
  document: '',
  address: '',
  service_rate_per_m2: '',
  notes: '',
  status: 'Ativo',
})

const statuses = ['Ativo', 'Inativo']

onMounted(async () => {
  if (!isEdit.value) return

  fetching.value = true
  try {
    const { data } = await api.get(`/clients/${route.params.id}`)
    if (data?.success) {
      const client = data.data
      form.name = client.name
      form.email = client.email ?? ''
      form.phone = client.phone ?? ''
      form.document = client.document ?? ''
      form.address = client.address ?? ''
      form.service_rate_per_m2 = String(client.service_rate_per_m2 ?? '')
      form.notes = client.notes ?? ''
      form.status = client.active ? 'Ativo' : 'Inativo'
    }
  } catch (err) {
    console.error('Failed to load client:', err)
    swal.error('Erro', 'Não foi possível carregar o cliente.')
    router.push('/clients')
  } finally {
    fetching.value = false
  }
})

const handleSave = async () => {
  loading.value = true
  try {
    const payload = {
      name: form.name,
      email: form.email || undefined,
      phone: form.phone || undefined,
      document: form.document || undefined,
      address: form.address || undefined,
      service_rate_per_m2: Number(form.service_rate_per_m2) || 0,
      notes: form.notes || undefined,
    }

    if (isEdit.value) {
      payload.is_active = form.status === 'Ativo'
      await api.put(`/clients/${route.params.id}`, payload)
      swal.success('Sucesso', 'Cliente atualizado com sucesso!')
    } else {
      await api.post('/clients', payload)
      swal.success('Sucesso', 'Cliente cadastrado com sucesso!')
    }

    router.push('/clients')
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Não foi possível salvar o cliente.'
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
            {{ isEdit ? 'Editar Cliente' : 'Novo Cliente' }}
          </h1>
          <p class="mt-1 text-sm text-marble-600">
            O valor por m² será usado automaticamente nas obras deste cliente.
          </p>
        </div>
      </div>
    </div>

    <Card>
      <div v-if="fetching" class="flex justify-center p-8 text-marble-500">Carregando...</div>
      <form v-else @submit.prevent="handleSave" class="space-y-6 w-full">
        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <Input v-model="form.name" label="Nome" placeholder="Nome do cliente" required />
          </div>
          <Input v-model="form.email" label="E-mail" type="email" placeholder="email@cliente.com" />
          <Input v-model="form.phone" label="Telefone" placeholder="(00) 00000-0000" />
          <Input v-model="form.document" label="Documento" placeholder="CPF ou CNPJ" />
          <Input
            v-model="form.service_rate_per_m2"
            label="Valor de serviço (R$/m²)"
            type="number"
            placeholder="0,00"
            required
          />
          <div class="sm:col-span-2">
            <Input v-model="form.address" label="Endereço" placeholder="Endereço do cliente" />
          </div>
          <div class="sm:col-span-2">
            <Textarea v-model="form.notes" label="Observações" rows="3" />
          </div>
          <div v-if="isEdit" class="sm:col-span-1">
            <Select v-model="form.status" label="Status" :options="statuses" required />
          </div>
        </div>

        <div class="pt-4 flex justify-end gap-3 border-t border-marble-200">
          <Button type="button" variant="ghost" @click="router.back()">Cancelar</Button>
          <Button type="submit" variant="primary" :loading="loading">
            <i class="fa-solid fa-floppy-disk mr-2"></i>
            {{ isEdit ? 'Salvar alterações' : 'Salvar cliente' }}
          </Button>
        </div>
      </form>
    </Card>
  </div>
</template>
