<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Card from '@/components/utils/Card.vue'
import Input from '@/components/utils/Input.vue'
import Button from '@/components/utils/Button.vue'
import Switch from '@/components/utils/Switch.vue'
import { useSwal } from '@/utils/swal'
import api from '@/services/api'

const router = useRouter()
const route = useRoute()
const swal = useSwal()

const isEdit = computed(() => !!route.params.id)

const form = reactive({
  name: '',
  slug: '',
  isActive: true
})

const loading = ref(false)
const fetching = ref(false)

onMounted(async () => {
  if (isEdit.value) {
    fetching.value = true
    try {
      const { data } = await api.get(`/companies/${route.params.id}`)
      if (data && data.success) {
        form.name = data.data.name
        form.slug = data.data.slug
        form.isActive = !!data.data.isActive
      }
    } catch (err) {
      console.error('Erro ao carregar empresa:', err)
      swal.error('Erro', 'Não foi possível carregar as informações desta empresa.')
      router.push('/companies')
    } finally {
      fetching.value = false
    }
  }
})

const handleSave = async () => {
  if (!form.name || form.name.length < 3) {
    swal.error('Validação', 'O nome deve ter pelo menos 3 caracteres.')
    return
  }
  if (!form.slug || form.slug.length < 3) {
    swal.error('Validação', 'O slug deve ter pelo menos 3 caracteres.')
    return
  }

  loading.value = true
  try {
    const payload = {
      name: form.name,
      slug: form.slug,
      is_active: form.isActive
    }

    if (isEdit.value) {
      await api.put(`/companies/${route.params.id}`, payload)
      swal.success('Sucesso', 'Empresa atualizada com sucesso!')
    } else {
      await api.post('/companies', payload)
      swal.success('Sucesso', 'Empresa criada com sucesso!')
    }
    router.push('/companies')
  } catch (err) {
    console.error('Erro ao salvar empresa:', err)
    const errorMsg = err.response?.data?.message || 'Ocorreu um erro ao salvar os dados da empresa.'
    swal.error('Erro', errorMsg)
  } finally {
    loading.value = false
  }
}

const cancel = () => {
  router.push('/companies')
}
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
          {{ isEdit ? 'Editar Empresa' : 'Nova Empresa' }}
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          {{ isEdit ? 'Edite as informações da empresa cadastrada.' : 'Cadastre uma nova empresa (tenant) no sistema.' }}
        </p>
      </div>
    </div>

    <Card :loading="fetching">
      <form @submit.prevent="handleSave" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            v-model="form.name"
            label="Nome da Empresa"
            placeholder="Ex: Pillar Arquitetura"
            required
            :disabled="loading"
          />

          <Input
            v-model="form.slug"
            label="Slug / Identificador"
            placeholder="ex: pillar-arquitetura"
            required
            :disabled="loading"
          />
        </div>

        <div class="flex items-center gap-3 py-2">
          <Switch
            v-model="form.isActive"
            label="Empresa Ativa"
            description="Se desativada, os usuários desta empresa não conseguirão acessar o sistema."
            :disabled="loading"
          />
        </div>

        <div class="flex justify-end gap-3 pt-6 border-t border-marble-200">
          <Button
            type="button"
            variant="secondary"
            @click="cancel"
            :disabled="loading"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            :loading="loading"
          >
            {{ isEdit ? 'Salvar Alterações' : 'Criar Empresa' }}
          </Button>
        </div>
      </form>
    </Card>
  </div>
</template>
