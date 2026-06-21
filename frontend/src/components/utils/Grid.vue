<template>
    <div class="grid-wrapper ag-theme-quartz">
        <AgGridVue class="grid" theme="legacy" :rowData="rowData" :columnDefs="columnDefs" :columnTypes="columnTypes" :defaultColDef="defaultColDef" :localeText="localeText" :rowSelection="rowSelection" @grid-ready="onGridReady" @selection-changed="onSelectionChanged" />
        
        <!-- Painel de Paginação Premium Customizado -->
        <div class="custom-pagination">
            <div class="pagination-info">
                Exibindo <span class="highlight">{{ fromRecord }}</span> a <span class="highlight">{{ toRecord }}</span> de <span class="highlight">{{ totalRows }}</span> registros
            </div>
            
            <div class="pagination-controls">
                <button class="pag-btn" :disabled="currentPage === 1" @click="changePage(1)" title="Primeira Página">
                    <i class="fa-solid fa-angles-left"></i>
                </button>
                <button class="pag-btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)" title="Página Anterior">
                    <i class="fa-solid fa-angle-left"></i>
                </button>
                
                <button 
                    v-for="page in visiblePages" 
                    :key="page" 
                    class="pag-btn page-num" 
                    :class="{ active: page === currentPage }"
                    @click="changePage(page)"
                >
                    {{ page }}
                </button>
                
                <button class="pag-btn" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)" title="Próxima Página">
                    <i class="fa-solid fa-angle-right"></i>
                </button>
                <button class="pag-btn" :disabled="currentPage === totalPages" @click="changePage(totalPages)" title="Última Página">
                    <i class="fa-solid fa-angles-right"></i>
                </button>
            </div>
            
            <div class="pagination-size">
                <span>Registros por página:</span>
                <select :value="pageSize" @change="changePageSize($event)" class="size-select">
                    <option :value="10">10</option>
                    <option :value="25">25</option>
                    <option :value="50">50</option>
                    <option :value="100">100</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import { ModuleRegistry, ClientSideRowModelModule, CellStyleModule, RowSelectionModule, TextFilterModule, NumberFilterModule, DateFilterModule, LocaleModule, ValidationModule } from 'ag-grid-community'

/* ===============================
   REGISTRO DOS MÓDULOS
================================ */
ModuleRegistry.registerModules([ClientSideRowModelModule, CellStyleModule, RowSelectionModule, TextFilterModule, NumberFilterModule, DateFilterModule, LocaleModule, ValidationModule])

/* ===============================
   PROPS
================================ */
const props = defineProps({
    rowData: { type: Array, required: true },
    columnDefs: { type: Array, required: true },
    defaultColDef: { type: Object, default: () => ({ sortable: true, filter: true, floatingFilter: false, resizable: true }) },
    currentPage: { type: Number, default: 1 },
    pageSize: { type: Number, default: 50 },
    totalRows: { type: Number, default: 0 }
})

/* ===============================
   EMITS
================================ */
const emit = defineEmits(['update:selection', 'update:page', 'update:pageSize'])

/* ===============================
   GRID API
================================ */
const gridApi = ref(null)

const onGridReady = (params) => {
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
const rowSelection = {
    mode: 'multiRow',
    checkboxes: true,
    headerCheckbox: true,
}

const localeText = {
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
        valueFormatter: (params) => {
            if (!params.value) return ''
            return new Date(params.value).toLocaleDateString('pt-BR')
        },
    },

    datetime: {
        filter: 'agDateColumnFilter',
        valueFormatter: (params) => {
            if (!params.value) return ''
            return new Date(params.value).toLocaleString('pt-BR')
        },
    },

    money: {
        filter: 'agNumberColumnFilter',
        valueFormatter: (params) => {
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

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
        emit('update:page', page)
    }
}

const changePageSize = (event) => {
    const size = parseInt(event.target.value, 10)
    emit('update:pageSize', size)
    emit('update:page', 1)
}
</script>

<style scoped>
.grid-wrapper {
    width: 100%;
    height: 80vh;
    display: flex;
    flex-direction: column;
}

.grid-wrapper .grid {
    width: 100%;
    flex: 1;
    min-height: 0;
}

.grid-wrapper .grid :deep(.cell-center) {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.grid-wrapper .grid :deep(.cell-right) {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    text-align: right;
}

.grid-wrapper .grid :deep(.cell-left) {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    text-align: left;
}

.custom-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    background: #ffffff;
    border-top: 1px solid #f3f4f6;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    font-size: 0.875rem;
    color: #4b5563;
    flex-wrap: wrap;
    gap: 12px;
}

.custom-pagination .pagination-info {
    font-weight: 500;
}

.custom-pagination .pagination-info .highlight {
    color: #4f46e5;
    font-weight: 600;
}

.custom-pagination .pagination-controls {
    display: flex;
    align-items: center;
    gap: 6px;
}

.custom-pagination .pagination-controls .pag-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    color: #374151;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    outline: none;
}

.custom-pagination .pagination-controls .pag-btn:hover:not(:disabled) {
    background: #f3f4f6;
    border-color: #d1d5db;
    color: #111827;
}

.custom-pagination .pagination-controls .pag-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.custom-pagination .pagination-controls .pag-btn.page-num {
    font-size: 0.875rem;
}

.custom-pagination .pagination-controls .pag-btn.page-num.active {
    background: #4f46e5;
    border-color: #4f46e5;
    color: #ffffff;
    font-weight: 600;
}

.custom-pagination .pagination-size {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
}

.custom-pagination .pagination-size .size-select {
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    background-color: #ffffff;
    color: #374151;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    outline: none;
    transition: border-color 0.2s ease;
}

.custom-pagination .pagination-size .size-select:focus {
    border-color: #4f46e5;
}

@media (max-width: 768px) {
    .custom-pagination {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 16px;
    }
    .custom-pagination .pagination-info {
        order: 1;
    }
    .custom-pagination .pagination-controls {
        order: 2;
        width: 100%;
        justify-content: center;
    }
    .custom-pagination .pagination-size {
        order: 3;
    }
}
</style>