<template>
  <div class="relative w-full flex flex-col gap-1.5" ref="root" :class="attrs.class">
    <label v-if="label" v-html="label" class="block text-[13px] font-medium text-gray-700"></label>

    <div 
      class="flex items-center min-h-[42px] px-3 py-1.5 border-[1.5px] rounded-lg bg-white cursor-pointer transition-all duration-200 select-none gap-2"
      :class="[
        disabled ? 'bg-gray-50 opacity-65 cursor-not-allowed pointer-events-none border-gray-200' : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/30',
        isOpen ? 'border-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.12)] bg-white' : '',
        search ? 'cursor-text' : ''
      ]"
      @click="handleDisplayClick" 
      tabindex="0" 
      role="combobox" 
      :aria-expanded="isOpen.toString()"
    >
      <!-- Single value / multi tags -->
      <div class="flex-1 min-w-0 flex items-center">
        <template v-if="multiple">
          <div class="flex-1 flex flex-wrap gap-1.5 items-center">
            <span v-for="opt in selectedOptions" :key="opt.value" class="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md px-2 py-0.5 text-[12.5px] font-medium">
              <span v-html="opt.label"></span>
              <button type="button" class="inline-flex items-center justify-center bg-transparent border-none text-indigo-400 hover:text-indigo-700 cursor-pointer p-0 rounded-sm transition-colors" @click.stop="removeOption(opt)">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1 1L8 8M8 1L1 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                </svg>
              </button>
            </span>
            <input v-if="search" ref="searchInputRef" v-model="searchTerm" class="flex-1 min-w-[60px] border-none outline-none bg-transparent text-sm text-gray-900 p-0 placeholder-gray-400"
              :placeholder="selectedOptions.length ? '' : (placeholder || 'Selecionar...')" @click.stop />
            <span v-else-if="!selectedOptions.length" class="flex-1 text-gray-400 text-sm">
              {{ placeholder || 'Selecionar...' }}
            </span>
          </div>
        </template>

        <template v-else>
          <div class="flex-1 min-w-0 flex items-center">
            <span v-if="(!isOpen || !search) && selectedOptions.length" class="flex-1 whitespace-nowrap overflow-hidden text-ellipsis text-sm text-gray-900"
              v-html="selectedOptions[0]?.label"></span>
            <span v-else-if="(!isOpen || !search) && !selectedOptions.length" class="flex-1 text-gray-400 text-sm">
              {{ placeholder || 'Selecionar...' }}
            </span>
            <input v-if="search" v-show="isOpen" ref="searchInputRef" v-model="searchTerm" class="flex-1 min-w-[60px] border-none outline-none bg-transparent text-sm text-gray-900 p-0 placeholder-gray-400"
              :placeholder="selectedOptions[0]?.label || placeholder || 'Buscar...'" @click.stop />
          </div>
        </template>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1.5 flex-shrink-0">
        <button v-if="canClear" type="button" class="inline-flex items-center justify-center w-[22px] h-[22px] rounded-md bg-transparent border-none cursor-pointer p-0 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors" @click.stop="clear" title="Limpar seleção">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M1 1L10 10M10 1L1 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </button>
        <button v-if="link" type="button" class="inline-flex items-center justify-center w-[22px] h-[22px] rounded-md bg-transparent border-none cursor-pointer p-0 text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 transition-colors" @click.stop="navigateToLink" title="Acessar">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M5 2H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V7M8 1h3m0 0v3m0-3L5 6" stroke="currentColor"
              stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <span class="flex items-center text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': isOpen }">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 5L7 9.5L11.5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </div>
    </div>

    <!-- Dropdown -->
    <Transition 
      enter-active-class="transition ease-out duration-150"
      enter-from-class="opacity-0 -translate-y-1 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-1 scale-95"
    >
      <div v-if="isOpen" class="absolute top-[calc(100%+6px)] left-0 right-0 z-[9999] bg-white border-[1.5px] border-gray-200 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden" role="listbox" :aria-multiselectable="multiple.toString()" @click.stop>
        
        <ul class="m-0 py-1.5 max-h-[240px] overflow-y-auto custom-scrollbar">
          <li v-if="filteredOptions.length === 0" class="flex items-center justify-center gap-2 py-2 px-3 text-sm text-gray-400 italic cursor-default">
            <svg class="opacity-50" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3">
              <circle cx="8" cy="8" r="6.5" />
              <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" />
            </svg>
            Nenhuma opção encontrada
          </li>
          <li v-for="opt in filteredOptions" :key="opt.value" 
            class="flex items-center gap-2 py-2.5 px-3 text-sm cursor-pointer transition-colors"
            :class="[
              opt.disabled ? 'text-gray-400 cursor-not-allowed hover:bg-transparent' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700',
              isSelected(opt) && !opt.disabled ? 'bg-indigo-50/50 text-indigo-700 font-medium' : ''
            ]" 
            @click.stop="select(opt)" role="option" :aria-selected="isSelected(opt).toString()">
            
            <span v-if="multiple" 
              class="w-4 h-4 border-[1.5px] rounded flex items-center justify-center flex-shrink-0 transition-colors text-white"
              :class="isSelected(opt) ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300'"
            >
              <svg v-if="isSelected(opt)" width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5L4 7.5L8.5 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <span v-else-if="isSelected(opt)" class="inline-flex items-center justify-center flex-shrink-0 text-indigo-500">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <span class="flex-1" v-html="opt.label"></span>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick, useAttrs } from 'vue'
import { useRouter } from 'vue-router'

interface Option {
  value: string | number
  label: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    options: Option[]
    label?: string
    modelValue: string | number | Array<string | number> | null
    multiple?: boolean
    search?: boolean
    placeholder?: string
    clearable?: boolean
    link?: string
    disabled?: boolean
  }>(),
  {
    multiple: false,
    search: false,
    clearable: true,
    disabled: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: string | number | Array<string | number> | null): void
  (e: 'change', val: string | number | Array<string | number> | null): void
}>()

const attrs = useAttrs()
const router = useRouter()
const multiple = computed(() => !!props.multiple)
const search = computed(() => !!props.search)
const placeholder = computed(() => props.placeholder || '')
const clearable = computed(() => !!props.clearable)

const isOpen = ref(false)
const searchTerm = ref('')
const root = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)

const selectedValues = ref<Array<string | number>>(
  multiple.value
    ? Array.isArray(props.modelValue) ? [...props.modelValue] : []
    : props.modelValue != null ? [props.modelValue as string | number] : []
)

watch(
  () => props.modelValue,
  (nv) => {
    if (multiple.value) {
      selectedValues.value = Array.isArray(nv) ? [...nv] : []
    } else {
      selectedValues.value = nv != null ? [nv as string | number] : []
    }
  },
)

const filteredOptions = computed(() => {
  if (search.value && searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    return props.options.filter((o) => o.label.toLowerCase().includes(term))
  }
  return props.options
})

const selectedOptions = computed(() => props.options.filter((o) => selectedValues.value.includes(o.value)))

const canClear = computed(() => clearable.value && selectedOptions.value.length > 0)

function isSelected(opt: Option) {
  return selectedValues.value.includes(opt.value)
}

function select(opt: Option) {
  if (opt.disabled || props.disabled) return
  if (multiple.value) {
    if (isSelected(opt)) {
      selectedValues.value = selectedValues.value.filter((v) => v !== opt.value)
    } else {
      selectedValues.value = [...selectedValues.value, opt.value]
    }
    emit('update:modelValue', selectedValues.value)
    emit('change', selectedValues.value)
  } else {
    selectedValues.value = opt.value != null ? [opt.value] : []
    emit('update:modelValue', selectedValues.value[0] ?? null)
    emit('change', selectedValues.value[0] ?? null)
    close()
  }
}

function removeOption(opt: Option) {
  if (!multiple.value) return
  selectedValues.value = selectedValues.value.filter((v) => v !== opt.value)
  emit('update:modelValue', selectedValues.value)
  emit('change', selectedValues.value)
}

function clear() {
  if (!canClear.value) return
  selectedValues.value = []
  emit('update:modelValue', multiple.value ? [] : null)
  emit('change', multiple.value ? [] : null)
  close()
}

function handleDisplayClick(e: Event) {
  if (props.disabled) return
  if (isOpen.value && searchInputRef.value && e.target === searchInputRef.value) return

  isOpen.value = !isOpen.value
  if (isOpen.value && search.value) {
    searchTerm.value = ''
    nextTick(() => searchInputRef.value?.focus())
  } else {
    searchTerm.value = ''
  }
}

function close() {
  isOpen.value = false
  searchTerm.value = ''
}

function navigateToLink() {
  if (props.link) {
    router.push({ name: props.link }).catch(() => {
      router.push('/' + props.link)
    })
  }
}

function handleClickOutside(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) {
    close()
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', handleClickOutside))
</script>

<style>
/* 
  Estilo local super simples apenas para o scrollbar
  Todo o resto é Tailwind 
*/
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 4px;
}
</style>