<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="mb-10 border-b border-gray-200 pb-5">
      <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Design System Showcase</h1>
      <p class="mt-2 text-sm text-gray-500">Visualização de todos os componentes de UI disponíveis na arquitetura.</p>
    </div>

    <div class="space-y-16">
      
      <!-- 1. Buttons -->
      <section>
        <h2 class="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <div class="w-2 h-6 bg-blue-600 rounded-full"></div>
          Buttons
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6 bg-white rounded-xl ring-1 ring-gray-100 shadow-sm">
          <div class="space-y-4">
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Variantes</h3>
            <div class="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="success">Success</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="warning">Warning</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Tamanhos</h3>
            <div class="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Estados</h3>
            <div class="flex flex-wrap gap-3">
              <Button disabled>Disabled</Button>
              <Button loading>Loading</Button>
              <Button variant="danger" loading>Deleting</Button>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. Inputs & Textareas -->
      <section>
        <h2 class="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <div class="w-2 h-6 bg-blue-600 rounded-full"></div>
          Inputs & Textareas
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-white rounded-xl ring-1 ring-gray-100 shadow-sm">
          <Input v-model="form.inputNormal" label="Input Padrão" placeholder="Digite algo..." />
          <Input v-model="form.inputRequired" label="Input Obrigatório" required placeholder="Campo obrigatório" />
          <Input v-model="form.inputDisabled" label="Input Desativado" disabled placeholder="Não editável" />
          <Input v-model="form.inputError" label="Input com Erro" error="E-mail inválido" placeholder="voce@email.com" />
          
          <div class="md:col-span-2">
            <Textarea v-model="form.textarea" label="Textarea Padrão" placeholder="Escreva um comentário longo..." rows="3" />
          </div>
        </div>
      </section>

      <!-- 3. Select (AgGrid Tailwind Style) -->
      <section>
        <h2 class="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <div class="w-2 h-6 bg-blue-600 rounded-full"></div>
          Select Customizado
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-white rounded-xl ring-1 ring-gray-100 shadow-sm">
          <Select 
            v-model="form.selectSingle" 
            label="Single Select (Padrão)" 
            :options="selectOptions" 
            placeholder="Escolha um cargo" 
          />
          
          <Select 
            v-model="form.selectSearchable" 
            label="Searchable Select" 
            :options="selectOptions" 
            search 
            placeholder="Pesquise um cargo..." 
          />
          
          <Select 
            v-model="form.selectMulti" 
            label="Multi Select (Tags)" 
            :options="selectOptions" 
            multiple 
            placeholder="Selecione vários cargos" 
          />

          <Select 
            v-model="form.selectDisabled" 
            label="Select Desativado" 
            :options="selectOptions" 
            disabled 
            placeholder="Desativado" 
          />
        </div>
      </section>

      <!-- 4. Switches, Checkboxes & Radios -->
      <section>
        <h2 class="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <div class="w-2 h-6 bg-blue-600 rounded-full"></div>
          Toggles & Checks
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-white rounded-xl ring-1 ring-gray-100 shadow-sm">
          <div class="space-y-4">
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Checkbox</h3>
            <Checkbox v-model="form.check1" label="Checkbox Padrão" />
            <Checkbox v-model="form.check2" label="Checkbox Marcado" />
            <Checkbox v-model="form.check3" label="Checkbox Desativado" disabled />
          </div>

          <div class="space-y-4">
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Switch</h3>
            <Switch v-model="form.switch1" label="Switch Padrão" />
            <Switch v-model="form.switch2" label="Switch Ativado" />
            <Switch v-model="form.switch3" label="Switch Desativado" disabled />
          </div>

          <div class="space-y-4">
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Radio</h3>
            <Radio v-model="form.radio" name="plan" value="basic" label="Plano Básico" />
            <Radio v-model="form.radio" name="plan" value="pro" label="Plano Pro" />
            <Radio v-model="form.radio" name="plan" value="enterprise" label="Plano Enterprise" disabled />
          </div>
        </div>
      </section>

      <!-- 5. Card & EmptyState -->
      <section>
        <h2 class="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <div class="w-2 h-6 bg-blue-600 rounded-full"></div>
          Layout & Data Display
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card title="Exemplo de Card" subtitle="Este é um subtítulo explicativo">
            <div class="p-4 bg-gray-50 rounded-md border border-gray-100 text-sm text-gray-500 text-center">
              Conteúdo interno do Card
            </div>
          </Card>
          
          <Card>
            <EmptyState 
              title="Nenhum projeto encontrado" 
              description="Você ainda não possui projetos cadastrados. Comece criando o seu primeiro."
            >
              <template #action>
                <Button variant="primary">Criar Projeto</Button>
              </template>
            </EmptyState>
          </Card>
        </div>
      </section>

      <!-- 6. Modal & SweetAlert2 -->
      <section>
        <h2 class="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <div class="w-2 h-6 bg-blue-600 rounded-full"></div>
          Modais & Alertas (SweetAlert2)
        </h2>
        
        <div class="flex flex-wrap gap-4 p-6 bg-white rounded-xl ring-1 ring-gray-100 shadow-sm">
          <Button variant="primary" @click="isModalOpen = true">Abrir Modal Customizado</Button>
          <Button variant="danger" @click="testSwalConfirm">Testar Swal (Confirm)</Button>
          <Button variant="success" @click="testSwalSuccess">Testar Swal (Success)</Button>
        </div>

        <Modal v-model="isModalOpen" title="Adicionar Novo Cliente" :width="500">
          <p class="text-gray-600 mb-4">Este é um exemplo do Modal reescrito usando Tailwind CSS, responsivo e com backdrop blur.</p>
          <div class="space-y-4">
            <Input v-model="form.modalInput" label="Nome do Cliente" />
            <Select v-model="form.modalSelect" label="Categoria" :options="[{label: 'VIP', value: 'vip'}, {label: 'Comum', value: 'comum'}]" />
          </div>
          <template #actions>
            <Button variant="ghost" @click="isModalOpen = false">Cancelar</Button>
            <Button variant="primary" @click="isModalOpen = false">Salvar Dados</Button>
          </template>
        </Modal>
      </section>

      <!-- 7. AgGrid Vue -->
      <section>
        <h2 class="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <div class="w-2 h-6 bg-blue-600 rounded-full"></div>
          Ag-Grid (Grid.vue)
        </h2>
        
        <div class="bg-white rounded-xl ring-1 ring-gray-100 shadow-sm overflow-hidden">
          <!-- The wrapper around Grid must give it enough height -->
          <Grid 
            :rowData="gridData" 
            :columnDefs="gridColumns" 
            :totalRows="2"
            :currentPage="1"
            :pageSize="10"
            @update:selection="onGridSelection"
          />
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useSwal } from '@/utils/swal'

// Components
import Button from '@/components/utils/Button.vue'
import Input from '@/components/utils/Input.vue'
import Textarea from '@/components/utils/Textarea.vue'
import Select from '@/components/utils/Select.vue'
import Checkbox from '@/components/utils/Checkbox.vue'
import Switch from '@/components/utils/Switch.vue'
import Radio from '@/components/utils/Radio.vue'
import Card from '@/components/utils/Card.vue'
import EmptyState from '@/components/utils/EmptyState.vue'
import Modal from '@/components/utils/Modal.vue'
import Grid from '@/components/utils/Grid.vue'

const swal = useSwal()

// Form Data for v-model testing
const form = reactive({
  inputNormal: '',
  inputRequired: '',
  inputDisabled: 'Texto bloqueado',
  inputError: 'teste@email',
  textarea: '',
  selectSingle: null,
  selectSearchable: null,
  selectMulti: [],
  selectDisabled: null,
  check1: false,
  check2: true,
  check3: false,
  switch1: false,
  switch2: true,
  switch3: false,
  radio: 'basic',
  modalInput: '',
  modalSelect: null
})

// Select Options
const selectOptions = [
  { label: 'Arquiteto Sênior', value: 'arq_sr' },
  { label: 'Engenheiro Civil', value: 'eng_civil' },
  { label: 'Designer de Interiores', value: 'designer' },
  { label: 'Estagiário', value: 'estagiario', disabled: true },
]

// Modal State
const isModalOpen = ref(false)

// SweetAlert tests
const testSwalConfirm = async () => {
  const result = await swal.confirm({
    title: 'Apagar Projeto?',
    text: 'Todos os arquivos vinculados a este projeto serão perdidos.'
  })
  if (result.isConfirmed) {
    swal.success('Deletado!', 'Projeto apagado com sucesso.')
  }
}

const testSwalSuccess = () => {
  swal.success('Salvo', 'Suas alterações foram gravadas no banco de dados.')
}

// AgGrid Config
const gridColumns = [
  { field: 'id', headerName: 'ID', width: 90, sortable: true },
  { field: 'nome', headerName: 'Nome do Projeto', flex: 1, sortable: true, filter: true },
  { field: 'data', headerName: 'Data Entrega', type: 'date' },
  { field: 'valor', headerName: 'Valor (R$)', type: 'money' },
]

const gridData = [
  { id: 101, nome: 'Residencial Alphaville', data: '2024-12-15T00:00:00.000Z', valor: 45000 },
  { id: 102, nome: 'Reforma Escritório Centro', data: '2024-10-05T00:00:00.000Z', valor: 12500 },
]

const onGridSelection = (selected) => {
  console.log('Linhas selecionadas:', selected)
}
</script>
