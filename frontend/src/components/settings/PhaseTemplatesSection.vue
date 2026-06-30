<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import Button from '@/components/utils/Button.vue'
import Input from '@/components/utils/Input.vue'
import Textarea from '@/components/utils/Textarea.vue'
import { useSwal } from '@/utils/swal'
import api from '@/services/api'

const swal = useSwal()

const expanded = ref(false)
const loading = ref(true)
const saving = ref(false)
const templates = ref([])
const totalWeight = ref(0)
const editingId = ref(null)

const form = reactive({ name: '', description: '', weight_percent: '' })
const editForm = reactive({ name: '', description: '', weight_percent: '' })

const phaseColors = ['bg-charcoal', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-rose-500']

const weightStatus = computed(() => {
  if (totalWeight.value === 100) return 'ok'
  if (totalWeight.value > 100) return 'over'
  return 'under'
})

const remainingWeight = computed(() => 100 - totalWeight.value)

const weightStatusLabel = computed(() => {
  if (weightStatus.value === 'ok') return 'OK'
  if (weightStatus.value === 'over') return `+${totalWeight.value - 100}%`
  return `−${remainingWeight.value}%`
})

const phaseColor = (index) => phaseColors[index % phaseColors.length]

const loadTemplates = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/settings/phase-templates')
    if (data?.success) {
      templates.value = data.data.templates ?? []
      totalWeight.value = data.data.total_weight_percent ?? 0
    }
  } catch {
    swal.error('Erro', 'Não foi possível carregar as etapas.')
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
    swal.error('Erro', err.response?.data?.message || 'Não foi possível adicionar.')
  } finally {
    saving.value = false
  }
}

const startEdit = (template) => {
  editingId.value = template.id
  editForm.name = template.name
  editForm.description = template.description ?? ''
  editForm.weight_percent = String(template.weight_percent)
  expanded.value = true
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
    swal.error('Erro', err.response?.data?.message || 'Não foi possível atualizar.')
  } finally {
    saving.value = false
  }
}

const removeTemplate = async (templateId) => {
  const confirmed = await swal.confirm('Remover etapa', 'Deseja remover esta etapa?')
  if (!confirmed) return
  await api.delete(`/settings/phase-templates/${templateId}`)
  if (editingId.value === templateId) editingId.value = null
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
        <p class="text-sm font-semibold text-marble-900">Etapas de progresso</p>
        <p class="text-[11px] text-marble-500 truncate">
          {{ templates.length }} etapa{{ templates.length === 1 ? '' : 's' }} · soma 100%
        </p>
      </div>

      <div
        class="hidden sm:flex items-center gap-2 shrink-0 w-40"
        :class="{
          'text-green-700': weightStatus === 'ok',
          'text-amber-700': weightStatus === 'under',
          'text-red-700': weightStatus === 'over',
        }"
      >
        <span class="text-xs font-bold tabular-nums w-8">{{ totalWeight }}%</span>
        <div class="flex-1 h-1 rounded-full bg-marble-200 overflow-hidden flex">
          <div
            v-for="(template, index) in templates"
            :key="template.id"
            :class="phaseColor(index)"
            :style="{
              width: weightStatus === 'over'
                ? `${(template.weight_percent / totalWeight) * 100}%`
                : `${template.weight_percent}%`,
            }"
          />
          <div v-if="weightStatus === 'under'" class="bg-marble-300/50" :style="{ width: `${remainingWeight}%` }" />
        </div>
        <span class="text-[10px] font-medium tabular-nums w-7">{{ weightStatusLabel }}</span>
      </div>

      <i
        class="fa-solid fa-chevron-down text-[10px] text-marble-400 shrink-0 transition-transform"
        :class="{ 'rotate-180': expanded }"
      />
    </button>

    <div v-show="expanded" class="border-t border-marble-200 px-4 py-3 space-y-3">
      <div
        class="flex sm:hidden items-center gap-2 rounded-md border border-marble-200 px-2.5 py-1.5"
        :class="{
          'border-green-200 bg-green-50/50': weightStatus === 'ok',
          'border-amber-200 bg-amber-50/50': weightStatus === 'under',
          'border-red-200 bg-red-50/50': weightStatus === 'over',
        }"
      >
        <span class="text-xs font-bold tabular-nums">{{ totalWeight }}%</span>
        <div class="flex-1 h-1 rounded-full bg-marble-200 overflow-hidden flex">
          <div
            v-for="(template, index) in templates"
            :key="`m-${template.id}`"
            :class="phaseColor(index)"
            :style="{
              width: weightStatus === 'over'
                ? `${(template.weight_percent / totalWeight) * 100}%`
                : `${template.weight_percent}%`,
            }"
          />
          <div v-if="weightStatus === 'under'" class="bg-marble-300/50" :style="{ width: `${remainingWeight}%` }" />
        </div>
        <span class="text-[10px] font-medium tabular-nums">{{ weightStatusLabel }}</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-[1fr_64px_auto] gap-2 items-end">
        <Input v-model="form.name" label="Nova etapa" placeholder="Ex: Projeto executivo" />
        <Input v-model="form.weight_percent" label="%" type="number" min="0" max="100" placeholder="10" />
        <Button variant="primary" size="sm" class="sm:mb-0.5" :disabled="saving" @click="addTemplate">
          <i class="fa-solid fa-plus"></i>
        </Button>
      </div>

      <div v-if="loading" class="text-xs text-marble-500">Carregando...</div>
      <div v-else-if="templates.length === 0" class="text-xs text-marble-500">Nenhuma etapa.</div>
      <div v-else class="rounded-md border border-marble-200 divide-y divide-marble-100 max-h-44 overflow-y-auto">
        <div v-for="(template, index) in templates" :key="template.id">
          <div v-if="editingId !== template.id" class="flex items-center gap-2 px-2.5 py-1.5">
            <span class="h-1.5 w-1.5 rounded-full shrink-0" :class="phaseColor(index)" />
            <p class="flex-1 text-xs text-marble-900 truncate">{{ template.name }}</p>
            <span class="text-[11px] font-semibold tabular-nums text-marble-600 shrink-0">
              {{ template.weight_percent }}%
            </span>
            <button type="button" class="p-0.5 text-marble-400 hover:text-marble-700" @click.stop="startEdit(template)">
              <i class="fa-solid fa-pen text-[9px]"></i>
            </button>
            <button type="button" class="p-0.5 text-marble-400 hover:text-red-600" @click.stop="removeTemplate(template.id)">
              <i class="fa-solid fa-trash text-[9px]"></i>
            </button>
          </div>

          <div v-else class="p-2.5 bg-marble-50 space-y-2" @click.stop>
            <div class="grid grid-cols-[1fr_64px] gap-2">
              <Input v-model="editForm.name" label="Título" />
              <Input v-model="editForm.weight_percent" label="%" type="number" min="0" max="100" />
            </div>
            <Textarea v-model="editForm.description" label="Descrição" rows="1" />
            <div class="flex justify-end gap-2">
              <Button variant="secondary" size="sm" @click="cancelEdit">Cancelar</Button>
              <Button variant="primary" size="sm" :disabled="saving" @click="saveEdit(template.id)">Salvar</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
