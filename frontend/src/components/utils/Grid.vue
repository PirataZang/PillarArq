<template>
  <div class="w-full h-[80vh] flex flex-col ag-theme-quartz">
    <AgGridVue 
      class="w-full flex-1 min-h-0" 
      theme="legacy" 
      :rowData="rowData" 
      :columnDefs="columnDefs" 
      :columnTypes="columnTypes"
      :defaultColDef="defaultColDef" 
      :localeText="localeText" 
      :rowSelection="rowSelection" 
      @grid-ready="onGridReady"
      @selection-changed="onSelectionChanged" 
    />

    <!-- Painel de Paginação Premium Customizado -->
    <div class="flex flex-col md:flex-row justify-between items-center text-center md:text-left p-3 px-5 bg-white border-t border-gray-100 rounded-b-2xl text-sm text-gray-600 flex-wrap gap-4 md:gap-3">
      
      <div class="font-medium order-1 md:order-1">
        Exibindo <span class="text-blue-600 font-semibold">{{ fromRecord }}</span> a <span class="text-blue-600 font-semibold">{{ toRecord }}</span> de
        <span class="text-blue-600 font-semibold">{{ totalRows }}</span> registros
      </div>

      <div class="flex items-center gap-1.5 order-2 md:order-2 w-full md:w-auto justify-center">
        <button 
          class="inline-flex items-center justify-center w-[34px] h-[34px] rounded-lg border border-gray-200 bg-white text-gray-700 font-medium cursor-pointer transition-all outline-none hover:bg-gray-100 hover:border-gray-300 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed" 
          :disabled="currentPage === 1" @click="changePage(1)" title="Primeira Página">
          <i class="fa-solid fa-angles-left"></i>
        </button>
        <button 
          class="inline-flex items-center justify-center w-[34px] h-[34px] rounded-lg border border-gray-200 bg-white text-gray-700 font-medium cursor-pointer transition-all outline-none hover:bg-gray-100 hover:border-gray-300 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed" 
          :disabled="currentPage === 1" @click="changePage(currentPage - 1)"
          title="Página Anterior">
          <i class="fa-solid fa-angle-left"></i>
        </button>

        <button v-for="page in visiblePages" :key="page" 
          class="inline-flex items-center justify-center w-[34px] h-[34px] rounded-lg border text-sm cursor-pointer transition-all outline-none"
          :class="page === currentPage ? 'bg-blue-600 border-blue-600 text-white font-semibold' : 'border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-100 hover:border-gray-300 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed'" 
          @click="changePage(page)">
          {{ page }}
        </button>

        <button 
          class="inline-flex items-center justify-center w-[34px] h-[34px] rounded-lg border border-gray-200 bg-white text-gray-700 font-medium cursor-pointer transition-all outline-none hover:bg-gray-100 hover:border-gray-300 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed" 
          :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)"
          title="Próxima Página">
          <i class="fa-solid fa-angle-right"></i>
        </button>
        <button 
          class="inline-flex items-center justify-center w-[34px] h-[34px] rounded-lg border border-gray-200 bg-white text-gray-700 font-medium cursor-pointer transition-all outline-none hover:bg-gray-100 hover:border-gray-300 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed" 
          :disabled="currentPage === totalPages" @click="changePage(totalPages)"
          title="Última Página">
          <i class="fa-solid fa-angles-right"></i>
        </button>
      </div>

      <div class="flex items-center gap-2 font-medium order-3 md:order-3">
        <span>Registros por página:</span>
        <select :value="pageSize" @change="changePageSize($event)" class="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium cursor-pointer outline-none transition-colors focus:border-blue-600">
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import type { ColDef, ColGroupDef, GridApi, LocaleText } from 'ag-grid-community'
import { ModuleRegistry, ClientSideRowModelModule, CellStyleModule, RowSelectionModule, TextFilterModule, NumberFilterModule, DateFilterModule, LocaleModule, ValidationModule } from 'ag-grid-community'

/* ===============================
   REGISTRO DOS MÓDULOS
================================ */
ModuleRegistry.registerModules([ClientSideRowModelModule, CellStyleModule, RowSelectionModule, TextFilterModule, NumberFilterModule, DateFilterModule, LocaleModule, ValidationModule])

/* ===============================
   PROPS
================================ */
const props = withDefaults(defineProps<{
  rowData: any[]
  columnDefs: (ColDef | ColGroupDef)[]
  defaultColDef?: ColDef
  currentPage?: number
  pageSize?: number
  totalRows?: number
}>(), {
  currentPage: 1,
  pageSize: 50,
  totalRows: 0
})

/* ===============================
   EMITS
================================ */
const emit = defineEmits<{
  (e: 'update:selection', value: any[]): void
  (e: 'update:page', value: number): void
  (e: 'update:pageSize', value: number): void
}>()

/* ===============================
   GRID API
================================ */
const gridApi = ref<GridApi | null>(null)

const onGridReady = (params: { api: GridApi }) => {
  gridApi.value = params.api
}

const onSelectionChanged = () => {
  if (!gridApi.value) return
  const selectedData = gridApi.value.getSelectedNodes().map((node) => node.data)
  emit('update:selection', selectedData)
}

/* ===============================
   CONFIGS
================================ */
const rowSelection: any = {
  mode: 'multiRow',
  checkboxes: true,
  headerCheckbox: true,
}

const defaultColDef: ColDef = {
  sortable: true,
  filter: true,
  floatingFilter: false,
  resizable: true,
}

const localeText: LocaleText = {
  page: 'Página',
  more: 'Mais',
  to: 'até',
  of: 'de',
  next: 'Próxima',
  last: 'Última',
  first: 'Primeira',
  previous: 'Anterior',
  loadingOoo: 'Carregando...',
  selectAll: 'Selecionar tudo',
  searchOoo: 'Pesquisar...',
  blanks: 'Em branco',
  filterOoo: 'Filtrar...',
  equals: 'Igual',
  notEqual: 'Diferente',
  lessThan: 'Menor que',
  greaterThan: 'Maior que',
  contains: 'Contém',
  notContains: 'Não contém',
  startsWith: 'Começa com',
  endsWith: 'Termina com',
  blank: 'Vazio',
  notBlank: 'Não Vazio',
  after: 'Depois',
  before: 'Antes',
  true: 'Verdadeiro',
  between: 'Entre',
  false: 'Falso',
  applyFilter: 'Aplicar filtro',
  clearFilter: 'Limpar filtro',
}

const columnTypes = {
  date: {
    filter: 'agDateColumnFilter',
    valueFormatter: (params: any) => {
      if (!params.value) return ''
      return new Date(params.value).toLocaleDateString('pt-BR')
    },
  },
  datetime: {
    filter: 'agDateColumnFilter',
    valueFormatter: (params: any) => {
      if (!params.value) return ''
      return new Date(params.value).toLocaleString('pt-BR')
    },
  },
  money: {
    filter: 'agNumberColumnFilter',
    valueFormatter: (params: any) => {
      if (!params.value) return ''
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(params.value)
    },
  },
}

/* ===============================
   PAGINAÇÃO CUSTOMIZADA LOGIC
================================ */
const totalPages = computed(() => Math.ceil(props.totalRows / props.pageSize) || 1)
const fromRecord = computed(() => props.totalRows === 0 ? 0 : (props.currentPage - 1) * props.pageSize + 1)
const toRecord = computed(() => Math.min(props.currentPage * props.pageSize, props.totalRows))

const visiblePages = computed(() => {
  const pages = []
  const range = 2
  const start = Math.max(1, props.currentPage - range)
  const end = Math.min(totalPages.value, props.currentPage + range)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit('update:page', page)
  }
}

const changePageSize = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const size = parseInt(target.value, 10)
  emit('update:pageSize', size)
  emit('update:page', 1)
}
</script>

<style>
/* 
  AgGrid native cell alignment classes.
  We leave these since they are directly attached to grid configuration classes,
  but moved from SCSS to normal CSS for native use in colDefs.
*/
.grid .cell-center {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.grid .cell-right {
  display: flex;
  justify-content: end;
  align-items: end;
  text-align: right;
}

.grid .cell-left {
  display: flex;
  justify-content: start;
  align-items: start;
  text-align: left;
}
</style>