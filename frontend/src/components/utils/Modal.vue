<template>
  <div v-if="modelValue" class="fixed inset-0 w-screen h-screen bg-gray-900/60 backdrop-blur-[4px] flex items-center justify-center z-[1000] p-5 animate-in fade-in duration-200" @click.self="close">
    <div 
      class="bg-white rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] flex flex-col max-w-full max-h-full overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-300"
      :style="{ width: '100%', maxWidth: props.width + 'px', minHeight: props.height === 'auto' ? 'auto' : props.height + 'px' }"
    >
      <div class="flex justify-between items-center px-6 py-5 border-b border-gray-100">
        <div class="flex items-center gap-3 flex-1">
          <h3 class="m-0 text-xl font-semibold text-gray-900">{{ title }}</h3>
          <slot name="header-actions"></slot>
        </div>
        <button class="bg-transparent border-none text-gray-400 text-xl cursor-pointer flex items-center justify-center p-1 rounded-md transition-colors hover:text-gray-700 hover:bg-gray-100" @click="close" title="Fechar">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="p-6 flex-1 overflow-y-auto">
        <slot></slot>
      </div>

      <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3" v-if="$slots.actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  width: {
    type: [Number, String],
    default: 400
  },
  height: {
    type: [Number, String],
    default: 'auto'
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>
