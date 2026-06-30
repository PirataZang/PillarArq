<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DocumentEditor from '@/components/document-editor/DocumentEditor.vue'
import Select from '@/components/utils/Select.vue'
import Input from '@/components/utils/Input.vue'
import { DEFAULT_DOCUMENT_CONTENT } from '@/components/document-editor/extensions'
import { DEFAULT_BUDGET_DOCUMENT_CONTENT } from '@/components/document-editor/constants/defaultBudgetContent'
import { DOCUMENT_TYPE_OPTIONS } from '@/components/document-editor/constants/variables'
import { useSwal } from '@/utils/swal'
import { downloadDocumentPdf } from '@/utils/documentPdf'
import FormLogsButton from '@/components/audit/FormLogsButton.vue'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const swal = useSwal()

const loading = ref(true)
const saving = ref(false)
const downloading = ref(false)
const templateName = ref('Novo Template')
const documentType = ref('GERAL')
const content = ref(DEFAULT_DOCUMENT_CONTENT)
const clientId = ref('')
const clients = ref([])

const clientOptions = computed(() => [
  { value: '', label: 'Template geral (todos os clientes)' },
  ...clients.value.map((c) => ({ value: String(c.id), label: c.name })),
])

const isEdit = () => route.params.id && route.params.id !== 'create'

const loadClients = async () => {
  try {
    const { data } = await api.get('/clients')
    if (data?.success) clients.value = data.data
  } catch {
    /* optional */
  }
}

const applyDefaultContentForType = (type, force = false) => {
  if (isEdit() && !force) return

  if (type === 'ORCAMENTO') {
    content.value = structuredClone(DEFAULT_BUDGET_DOCUMENT_CONTENT)
    if (!templateName.value.trim() || templateName.value === 'Novo Template') {
      templateName.value = 'Orçamento Padrão'
    }
    return
  }

  content.value = structuredClone(DEFAULT_DOCUMENT_CONTENT)
}

watch(documentType, (type, previous) => {
  if (loading.value || type === previous) return

  if (!isEdit()) {
    applyDefaultContentForType(type, true)
    return
  }

  swal.info(
    'Tipo alterado',
    'As variáveis disponíveis no painel lateral foram atualizadas conforme o tipo do documento.'
  )
})

const loadTemplate = async () => {
  await loadClients()

  if (!isEdit()) {
    templateName.value = route.query.name?.toString() || 'Novo Template'
    clientId.value = route.query.client_id ? String(route.query.client_id) : ''
    documentType.value = route.query.document_type?.toString() || 'GERAL'
    applyDefaultContentForType(documentType.value, true)
    loading.value = false
    return
  }

  try {
    const { data } = await api.get(`/document-templates/${route.params.id}`)
    if (data?.success) {
      const template = data.data
      templateName.value = template.name
      documentType.value = template.document_type || 'GERAL'
      clientId.value = template.client_id ? String(template.client_id) : ''
      content.value = template.content ?? DEFAULT_DOCUMENT_CONTENT
    }
  } catch {
    swal.error('Erro', 'Não foi possível carregar o template.')
    router.push('/documents')
  } finally {
    loading.value = false
  }
}

onMounted(loadTemplate)

const handleSave = async (json) => {
  if (!templateName.value.trim()) {
    swal.error('Atenção', 'Informe o nome do template.')
    return
  }

  saving.value = true
  try {
    const payload = {
      name: templateName.value.trim(),
      document_type: documentType.value,
      content: json,
      client_id: clientId.value ? Number(clientId.value) : undefined,
    }

    if (isEdit()) {
      await api.put(`/document-templates/${route.params.id}`, payload)
    } else {
      const { data } = await api.post('/document-templates', payload)
      if (data?.success) {
        router.replace(`/documents/${data.data.id}/edit`)
      }
    }

    swal.success('Template salvo com sucesso!')
  } catch {
    swal.error('Erro', 'Não foi possível salvar o template.')
  } finally {
    saving.value = false
  }
}

const handlePreview = () => {
  swal.info('Preview', 'A visualização em tela será implementada em breve. Use Baixar PDF para ver o resultado.')
}

const handleDownload = async (json) => {
  if (!templateName.value.trim()) {
    swal.error('Atenção', 'Informe o nome do template antes de baixar o PDF.')
    return
  }

  downloading.value = true
  try {
    await downloadDocumentPdf({
      templateId: isEdit() ? route.params.id : undefined,
      name: templateName.value.trim(),
      content: json ?? content.value,
      clientId: clientId.value || undefined,
    })
    swal.success('PDF gerado com sucesso!')
  } catch {
    swal.error('Erro', 'Não foi possível gerar o PDF. Verifique se o serviço Gotenberg está em execução.')
  } finally {
    downloading.value = false
  }
}
</script>

<template>
  <div class="-mx-4 -my-6 sm:-mx-6 lg:-mx-8">
    <div v-if="loading" class="flex h-64 items-center justify-center text-marble-500">
      Carregando editor...
    </div>
    <div v-else class="space-y-4 px-4 sm:px-6">
      <div class="flex items-center justify-between gap-4">
        <div class="grid flex-1 gap-4 rounded-xl border border-marble-200 bg-white p-4 sm:grid-cols-3">
          <Input v-model="templateName" label="Nome do template" placeholder="Ex: Proposta comercial" />
          <Select
            v-model="documentType"
            label="Tipo do documento"
            :options="DOCUMENT_TYPE_OPTIONS"
            placeholder="Selecione o tipo"
          />
          <Select
            v-model="clientId"
            label="Cliente (opcional)"
            :options="clientOptions"
            placeholder="Template geral"
          />
        </div>
        <FormLogsButton
          v-if="isEdit()"
          subject-type="DocumentTemplate"
          :subject-id="route.params.id"
        />
      </div>

      <p v-if="documentType === 'ORCAMENTO'" class="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
        Templates de <strong>Orçamento</strong> utilizam apenas variáveis preenchidas na tela
        <strong>Gerar orçamento</strong> (Relatórios). Personalize o layout e as seções do documento padrão.
      </p>

      <DocumentEditor
        v-model="content"
        :title="templateName"
        :document-type="documentType"
        @save="handleSave"
        @preview="handlePreview"
        @download="handleDownload"
      />
    </div>
  </div>
</template>
