<script setup>
import { reactive, computed } from 'vue'
import Input from '@/components/utils/Input.vue'
import Button from '@/components/utils/Button.vue'
import { formatCurrency } from '@/utils/currency'
import { useSwal } from '@/utils/swal'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])
const swal = useSwal()

let nextId = 1

const materialForm = reactive({
  name: '',
  quantity: '1',
  unit: 'un',
  unit_price: '',
  supplier: '',
})

const materials = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const materialsTotal = computed(() =>
  materials.value.reduce((total, item) => {
    const qty = Number(item.quantity) || 0
    const price = Number(item.unit_price) || 0
    return total + qty * price
  }, 0)
)

const subtotalFor = (item) => (Number(item.quantity) || 0) * (Number(item.unit_price) || 0)

const resetForm = () => {
  materialForm.name = ''
  materialForm.quantity = '1'
  materialForm.unit = 'un'
  materialForm.unit_price = ''
  materialForm.supplier = ''
}

const addMaterial = () => {
  if (!materialForm.name.trim()) {
    swal.error('Atenção', 'Informe o nome do material.')
    return
  }
  if (!materialForm.quantity || Number(materialForm.quantity) <= 0) {
    swal.error('Atenção', 'Informe uma quantidade válida.')
    return
  }
  if (!materialForm.unit_price || Number(materialForm.unit_price) < 0) {
    swal.error('Atenção', 'Informe o preço unitário.')
    return
  }

  materials.value = [
    ...materials.value,
    {
      id: nextId++,
      name: materialForm.name.trim(),
      quantity: Number(materialForm.quantity),
      unit: materialForm.unit.trim() || 'un',
      unit_price: Number(materialForm.unit_price),
      supplier: materialForm.supplier.trim() || '',
    },
  ]
  resetForm()
}

const removeMaterial = async (id) => {
  const confirmed = await swal.confirm('Remover material', 'Deseja remover este item da lista?')
  if (!confirmed) return
  materials.value = materials.value.filter((item) => item.id !== id)
}
</script>

<template>
  <div class="space-y-6">
    <div class="rounded-xl border border-marble-200 bg-gradient-to-br from-white to-marble-50 p-4 sm:p-5">
      <div class="mb-4 flex items-center gap-3">
        <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
          <i class="fa-solid fa-plus"></i>
        </span>
        <div>
          <h3 class="text-sm font-semibold text-marble-900">Adicionar material</h3>
          <p class="text-xs text-marble-500">Os itens aparecerão na tabela do relatório para o cliente.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div class="sm:col-span-2 lg:col-span-1">
          <Input v-model="materialForm.name" label="Item" placeholder="Porcelanato 60x60" />
        </div>
        <Input v-model="materialForm.quantity" label="Qtd" type="number" min="0" step="0.01" />
        <Input v-model="materialForm.unit" label="Unidade" placeholder="m²" />
        <Input v-model="materialForm.unit_price" label="Preço unit." type="number" min="0" step="0.01" />
        <Input v-model="materialForm.supplier" label="Fornecedor" placeholder="Opcional" />
      </div>

      <div class="mt-4 flex justify-end">
        <Button type="button" variant="primary" @click="addMaterial">
          <i class="fa-solid fa-plus mr-2"></i>
          Adicionar à lista
        </Button>
      </div>
    </div>

    <div class="overflow-hidden rounded-xl border border-marble-200 bg-white">
      <div class="flex items-center justify-between border-b border-marble-200 bg-marble-50 px-4 py-3 sm:px-5">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-boxes-stacked text-marble-500"></i>
          <h3 class="text-sm font-semibold text-marble-900">Lista de materiais</h3>
          <span class="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-marble-600 ring-1 ring-marble-200">
            {{ materials.length }} {{ materials.length === 1 ? 'item' : 'itens' }}
          </span>
        </div>
        <p class="text-sm font-semibold text-marble-900">
          Total: <span class="text-sky-700">{{ formatCurrency(materialsTotal) }}</span>
        </p>
      </div>

      <div v-if="!materials.length" class="px-4 py-10 text-center sm:px-5">
        <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-marble-100 text-marble-400">
          <i class="fa-solid fa-box-open text-lg"></i>
        </div>
        <p class="text-sm font-medium text-marble-700">Nenhum material adicionado</p>
        <p class="mt-1 text-xs text-marble-500">
          Adicione os materiais que compõem a base do orçamento. Eles serão exibidos no PDF.
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="border-b border-marble-200 bg-white text-left text-xs uppercase tracking-wide text-marble-500">
              <th class="px-4 py-3 font-semibold sm:px-5">Item</th>
              <th class="px-4 py-3 font-semibold">Qtd</th>
              <th class="px-4 py-3 font-semibold">Un.</th>
              <th class="px-4 py-3 font-semibold">Preço un.</th>
              <th class="px-4 py-3 font-semibold">Subtotal</th>
              <th class="px-4 py-3 font-semibold">Fornecedor</th>
              <th class="px-4 py-3 sm:px-5"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in materials"
              :key="item.id"
              class="border-b border-marble-100 transition-colors hover:bg-marble-50/80"
            >
              <td class="px-4 py-3 font-medium text-marble-900 sm:px-5">{{ item.name }}</td>
              <td class="px-4 py-3 text-marble-700">{{ item.quantity }}</td>
              <td class="px-4 py-3 text-marble-700">{{ item.unit }}</td>
              <td class="px-4 py-3 text-marble-700">{{ formatCurrency(item.unit_price) }}</td>
              <td class="px-4 py-3 font-medium text-marble-900">{{ formatCurrency(subtotalFor(item)) }}</td>
              <td class="px-4 py-3 text-marble-600">{{ item.supplier || '—' }}</td>
              <td class="px-4 py-3 text-right sm:px-5">
                <button
                  type="button"
                  class="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                  title="Remover"
                  @click="removeMaterial(item.id)"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
