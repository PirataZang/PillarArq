<script setup>

const props = defineProps({
  title: { type: String, default: 'Nenhum registro encontrado' },
  description: { type: String, default: 'Não há dados disponíveis no momento.' }
})
</script>

<template>
  <div class="flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg border border-dashed border-gray-300">
    <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
      <i class="fa-regular fa-folder-open text-gray-400 text-xl" aria-hidden="true"></i>
    </div>
    <h3 class="mt-4 text-sm font-semibold text-gray-900">{{ title }}</h3>
    <p class="mt-2 text-sm text-gray-500">{{ description }}</p>
    <div class="mt-6" v-if="$slots.action">
      <slot name="action"></slot>
    </div>
  </div>
</template>
