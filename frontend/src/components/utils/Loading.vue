<script setup>
import { useLoadingStore } from '@/stores/loading.store'

const loadingStore = useLoadingStore()

defineProps({
  text: {
    type: String,
    default: 'Carregando...'
  }
})
</script>

<template>
  <div 
    v-if="loadingStore.isLoading"
    class="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm transition-opacity"
  >
    <div class="flex flex-col items-center gap-4">
      <i class="fa-solid fa-circle-notch fa-spin text-marble-600 text-3xl mb-4"></i>
      <span class="text-sm font-medium text-marble-600 tracking-wide">{{ text }}</span>
    </div>
  </div>
</template>
