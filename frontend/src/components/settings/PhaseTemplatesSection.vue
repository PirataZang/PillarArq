<script setup>
import { ref, reactive, onMounted } from 'vue'
import Button from '@/components/utils/Button.vue'
import FormLogsButton from '@/components/audit/FormLogsButton.vue'
import Input from '@/components/utils/Input.vue'
import Textarea from '@/components/utils/Textarea.vue'
import Modal from '@/components/utils/Modal.vue'
import ColorPicker from '@/components/utils/ColorPicker.vue'
import { useSwal } from '@/utils/swal'
import api from '@/services/api'

const swal = useSwal()

const expanded = ref(false)
const loading = ref(true)
const saving = ref(false)
const templates = ref([])
const modalOpen = ref(false)
const editingTemplate = ref(null)

const form = reactive({ name: '', description: '', weight_percent: '', color: '#5c5852' })

const loadTemplates = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/settings/phase-templates')
    if (data?.success) {
      templates.value = data.data.templates ?? []
    }
  } catch {
    swal.error('Erro', 'Não foi possível carregar os status.')
  } finally {
    loading.value = false
  }
}

onMounted(loadTemplates)

const resetForm = () => {
  form.name = ''
  form.description = ''
  form.weight_percent = ''
  form.color = '#5c5852'
}

const openCreateModal = () => {
  editingTemplate.value = null
  resetForm()
  modalOpen.value = true
}

const openEditModal = (template) => {
  editingTemplate.value = template
  form.name = template.name
  form.description = template.description ?? ''
  form.weight_percent = String(template.weight_percent)
  form.color = template.color || '#5c5852'
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
  editingTemplate.value = null
  resetForm()
}

const saveTemplate = async () => {
  saving.value = true
  try {
    const payload = {
      name: form.name,
      description: form.description || (editingTemplate.value ? null : undefined),
      weight_percent: Number(form.weight_percent),
      color: form.color,
    }

    if (editingTemplate.value) {
      await api.put(`/settings/phase-templates/${editingTemplate.value.id}`, payload)
      swal.success('Sucesso', 'Status atualizado.')
    } else {
      await api.post('/settings/phase-templates', payload)
      swal.success('Sucesso', 'Status adicionado.')
    }

    closeModal()
    await loadTemplates()
  } catch (err) {
    swal.error('Erro', err.response?.data?.message || 'Não foi possível salvar.')
  } finally {
    saving.value = false
  }
}

const removeTemplate = async (templateId) => {
  const confirmed = await swal.confirm('Remover status', 'Deseja remover este status?')
  if (!confirmed) return
  await api.delete(`/settings/phase-templates/${templateId}`)
  await loadTemplates()
}
</script>

<template>
  <section class="rounded-lg border border-marble-200 bg-white shadow-sm overflow-hidden">
    <button
      type="button"
      class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-marble-50/80 transition-colors"
      @click="expanded = !expanded"
    >
      <div class="min-w-0 flex-1">
        <p class="text-sm font-semibold text-marble-900">Status de progresso</p>
        <p class="text-[11px] text-marble-500 truncate">
          {{ templates.length }} status configurado{{ templates.length === 1 ? '' : 's' }} com percentual fixo
        </p>
      </div>

      <i
        class="fa-solid fa-chevron-down text-[10px] text-marble-400 shrink-0 transition-transform"
        :class="{ 'rotate-180': expanded }"
      />
    </button>

    <div v-show="expanded" class="border-t border-marble-200 px-4 py-3 space-y-3">
      <div class="flex justify-end">
        <Button variant="primary" size="sm" @click="openCreateModal">
          <i class="fa-solid fa-plus mr-1.5"></i>
          Novo status
        </Button>
      </div>

      <div v-if="loading" class="text-xs text-marble-500">Carregando...</div>
      <div v-else-if="templates.length === 0" class="text-xs text-marble-500">Nenhum status.</div>
      <div v-else class="rounded-md border border-marble-200 divide-y divide-marble-100">
        <div v-for="template in templates" :key="template.id" class="flex items-center gap-3 px-3 py-2">
          <span class="h-4 w-4 rounded-full shrink-0 ring-1 ring-black/10" :style="{ backgroundColor: template.color || '#5c5852' }" />
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-marble-900 truncate">{{ template.name }}</p>
            <p v-if="template.description" class="text-[11px] text-marble-500 truncate">{{ template.description }}</p>
          </div>
          <span class="text-xs font-semibold tabular-nums text-marble-600 shrink-0">
            {{ template.weight_percent }}%
          </span>
          <div class="flex items-center gap-1">
            <button type="button" class="p-1.5 text-marble-400 hover:text-marble-700" @click.stop="openEditModal(template)">
              <i class="fa-solid fa-pen text-xs"></i>
            </button>
            <button type="button" class="p-1.5 text-marble-400 hover:text-red-600" @click.stop="removeTemplate(template.id)">
              <i class="fa-solid fa-trash text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <Modal v-model="modalOpen" :title="editingTemplate ? 'Editar status' : 'Novo status'" :width="560" @close="closeModal">
      <form id="phase-template-form" class="space-y-4" @submit.prevent="saveTemplate">
        <div class="grid grid-cols-1 sm:grid-cols-[1fr_96px] gap-3">
          <Input v-model="form.name" label="Nome" placeholder="Ex: Projeto executivo" required />
          <Input v-model="form.weight_percent" label="%" type="number" min="0" max="100" required />
        </div>
        <Textarea v-model="form.description" label="Descrição" rows="3" />
        <ColorPicker v-model="form.color" label="Cor do status" />
      </form>

      <template #actions>
        <FormLogsButton
          v-if="editingTemplate"
          subject-type="CompanyPhaseTemplate"
          :subject-id="editingTemplate.id"
        />
        <Button variant="secondary" @click="closeModal">Cancelar</Button>
        <Button type="submit" form="phase-template-form" variant="primary" :loading="saving">
          Salvar
        </Button>
      </template>
    </Modal>
  </section>
</template>
