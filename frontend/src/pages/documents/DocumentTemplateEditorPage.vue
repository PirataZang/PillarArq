<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DocumentEditor from '@/components/document-editor/DocumentEditor.vue'
import Select from '@/components/utils/Select.vue'
import Input from '@/components/utils/Input.vue'
import { DEFAULT_DOCUMENT_CONTENT } from '@/components/document-editor/extensions'
import { useSwal } from '@/utils/swal'
import { downloadDocumentPdf } from '@/utils/documentPdf'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const swal = useSwal()

const loading = ref(true)
const saving = ref(false)
const downloading = ref(false)
const templateName = ref('Novo Template')
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

const loadTemplate = async () => {
  await loadClients()

  if (!isEdit()) {
    templateName.value = route.query.name?.toString() || 'Novo Template'
    clientId.value = route.query.client_id ? String(route.query.client_id) : ''
    loading.value = false
    return
  }

  try {
    const { data } = await api.get(`/document-templates/${route.params.id}`)
    if (data?.success) {
      const template = data.data
      templateName.value = template.name
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
      <div class="grid gap-4 rounded-xl border border-marble-200 bg-white p-4 sm:grid-cols-2">
        <Input v-model="templateName" label="Nome do template" placeholder="Ex: Proposta comercial" />
        <Select
          v-model="clientId"
          label="Cliente (opcional)"
          :options="clientOptions"
          placeholder="Template geral"
        />
      </div>

      <DocumentEditor
        v-model="content"
        :title="templateName"
        @save="handleSave"
        @preview="handlePreview"
        @download="handleDownload"
      />
    </div>
  </div>
</template>
