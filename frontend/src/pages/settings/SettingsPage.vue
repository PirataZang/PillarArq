<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import Card from '@/components/utils/Card.vue'
import Button from '@/components/utils/Button.vue'
import Input from '@/components/utils/Input.vue'
import Textarea from '@/components/utils/Textarea.vue'
import { useSwal } from '@/utils/swal'
import api from '@/services/api'

const swal = useSwal()

const tabs = [{ id: 'general', label: 'Geral', icon: 'fa-sliders' }]
const activeTab = ref('general')

const loading = ref(true)
const saving = ref(false)
const templates = ref([])
const totalWeight = ref(0)
const editingId = ref(null)

const form = reactive({
  name: '',
  description: '',
  weight_percent: '',
})

const editForm = reactive({
  name: '',
  description: '',
  weight_percent: '',
})

const weightStatus = computed(() => {
  if (totalWeight.value === 100) return 'ok'
  if (totalWeight.value > 100) return 'over'
  return 'under'
})

const loadTemplates = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/settings/phase-templates')
    if (data?.success) {
      templates.value = data.data.templates ?? []
      totalWeight.value = data.data.total_weight_percent ?? 0
    }
  } catch (err) {
    swal.error('Erro', 'Não foi possível carregar as etapas de progresso.')
  } finally {
    loading.value = false
  }
}

onMounted(loadTemplates)

const resetForm = () => {
  form.name = ''
  form.description = ''
  form.weight_percent = ''
}

const addTemplate = async () => {
  saving.value = true
  try {
    await api.post('/settings/phase-templates', {
      name: form.name,
      description: form.description || undefined,
      weight_percent: Number(form.weight_percent),
    })
    resetForm()
    await loadTemplates()
    swal.success('Sucesso', 'Etapa adicionada.')
  } catch (err) {
    swal.error('Erro', err.response?.data?.message || 'Não foi possível adicionar a etapa.')
  } finally {
    saving.value = false
  }
}

const startEdit = (template) => {
  editingId.value = template.id
  editForm.name = template.name
  editForm.description = template.description ?? ''
  editForm.weight_percent = String(template.weight_percent)
}

const cancelEdit = () => {
  editingId.value = null
}

const saveEdit = async (templateId) => {
  saving.value = true
  try {
    await api.put(`/settings/phase-templates/${templateId}`, {
      name: editForm.name,
      description: editForm.description || null,
      weight_percent: Number(editForm.weight_percent),
    })
    editingId.value = null
    await loadTemplates()
    swal.success('Sucesso', 'Etapa atualizada.')
  } catch (err) {
    swal.error('Erro', err.response?.data?.message || 'Não foi possível atualizar a etapa.')
  } finally {
    saving.value = false
  }
}

const removeTemplate = async (templateId) => {
  const confirmed = await swal.confirm('Remover etapa', 'Deseja remover esta etapa de progresso?')
  if (!confirmed) return

  await api.delete(`/settings/phase-templates/${templateId}`)
  if (editingId.value === templateId) {
    editingId.value = null
  }
  await loadTemplates()
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-marble-900 tracking-tight">Configurações</h1>
      <p class="mt-1 text-sm text-marble-600">
        Ajuste as configurações da empresa disponíveis para o seu time.
      </p>
    </div>

    <div class="border-b border-marble-200 mb-4">
      <nav class="flex gap-1 overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
          :class="
            activeTab === tab.id
              ? 'border-charcoal text-marble-900'
              : 'border-transparent text-marble-500 hover:text-marble-700'
          "
        >
          <i :class="['fa-solid', tab.icon]"></i>
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <div v-if="activeTab === 'general'" class="space-y-4">
      <Card title="Etapas de progresso da obra">
        <p class="text-sm text-marble-600 mb-4">
          Defina as etapas padrão que serão aplicadas em novas obras. Cada etapa pode ter título,
          descrição e percentual personalizado. A soma ideal é 100%. Obras já criadas mantêm as
          etapas originais.
        </p>

        <div
          class="mb-4 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium"
          :class="{
            'bg-green-50 text-green-800 ring-1 ring-green-200': weightStatus === 'ok',
            'bg-amber-50 text-amber-800 ring-1 ring-amber-200': weightStatus === 'under',
            'bg-red-50 text-red-800 ring-1 ring-red-200': weightStatus === 'over',
          }"
        >
          <i
            class="fa-solid"
            :class="weightStatus === 'ok' ? 'fa-check-circle' : 'fa-triangle-exclamation'"
          ></i>
          Total: {{ totalWeight }}%
          <span v-if="weightStatus === 'under'">· faltam {{ 100 - totalWeight }}%</span>
          <span v-else-if="weightStatus === 'over'">· excede em {{ totalWeight - 100 }}%</span>
        </div>

        <div class="rounded-lg border border-marble-200 bg-marble-50/40 p-4 mb-4 space-y-3">
          <h4 class="text-sm font-semibold text-marble-900">Nova etapa</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input v-model="form.name" label="Título" placeholder="Ex: Projeto executivo" />
            <Input
              v-model="form.weight_percent"
              label="Percentual (%)"
              type="number"
              placeholder="10"
            />
          </div>
          <Textarea
            v-model="form.description"
            label="Descrição"
            rows="2"
            placeholder="Descreva o que acontece nesta etapa..."
          />
          <div class="flex justify-end">
            <Button variant="primary" size="sm" :disabled="saving" @click="addTemplate">
              <i class="fa-solid fa-plus mr-1.5"></i>
              Adicionar etapa
            </Button>
          </div>
        </div>

        <div v-if="loading" class="text-sm text-marble-500 py-4">Carregando etapas...</div>
        <div v-else-if="templates.length === 0" class="text-sm text-marble-500 py-2">
          Nenhuma etapa cadastrada.
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="(template, index) in templates"
            :key="template.id"
            class="rounded-lg border border-marble-200 overflow-hidden"
          >
            <div
              v-if="editingId !== template.id"
              class="flex items-start gap-3 px-3 py-2.5 bg-white"
            >
              <span class="text-xs text-marble-400 w-5 pt-0.5 shrink-0">{{ index + 1 }}</span>
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p class="text-sm font-medium text-marble-900">{{ template.name }}</p>
                  <span class="text-xs font-medium text-marble-600 bg-marble-100 px-2 py-0.5 rounded">
                    {{ template.weight_percent }}%
                  </span>
                </div>
                <p v-if="template.description" class="text-xs text-marble-500 mt-1 line-clamp-2">
                  {{ template.description }}
                </p>
              </div>
              <div class="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  class="p-1.5 text-marble-500 hover:text-marble-800"
                  title="Editar"
                  @click="startEdit(template)"
                >
                  <i class="fa-solid fa-pen text-xs"></i>
                </button>
                <button
                  type="button"
                  class="p-1.5 text-marble-400 hover:text-red-600"
                  title="Remover"
                  @click="removeTemplate(template.id)"
                >
                  <i class="fa-solid fa-trash text-xs"></i>
                </button>
              </div>
            </div>

            <div v-else class="p-3 bg-marble-50/50 space-y-3">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input v-model="editForm.name" label="Título" />
                <Input
                  v-model="editForm.weight_percent"
                  label="Percentual (%)"
                  type="number"
                />
              </div>
              <Textarea v-model="editForm.description" label="Descrição" rows="2" />
              <div class="flex justify-end gap-2">
                <Button variant="secondary" size="sm" @click="cancelEdit">Cancelar</Button>
                <Button variant="primary" size="sm" :disabled="saving" @click="saveEdit(template.id)">
                  Salvar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
