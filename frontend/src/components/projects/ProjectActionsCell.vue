<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  params: { type: Object, required: true },
})

const router = useRouter()

const openProject = () => {
  const id = props.params?.data?.id
  if (id) {
    router.push(`/projects/${id}`)
  }
}

const archiveProject = () => {
  props.params?.context?.onArchive?.(props.params.data)
}
</script>

<template>
  <div class="flex items-center justify-end gap-1 h-full">
    <button
      type="button"
      class="p-2 text-marble-400 hover:text-marble-800 hover:bg-marble-100 rounded-lg transition-colors"
      title="Visualizar obra"
      @click.stop="openProject"
    >
      <i class="fa-solid fa-eye text-sm"></i>
    </button>
    <button
      v-if="params?.context?.showArchive"
      type="button"
      class="p-2 text-marble-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      title="Arquivar obra"
      @click.stop="archiveProject"
    >
      <i class="fa-solid fa-box-archive text-sm"></i>
    </button>
  </div>
</template>
