<script setup>
const props = defineProps({
  modelValue: { type: String, default: '#5c5852' },
  label: { type: String, default: 'Cor' },
})

const emit = defineEmits(['update:modelValue'])

const colors = ['#5c5852', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899']
</script>

<template>
  <div class="w-full flex flex-col gap-2">
    <label class="text-sm font-medium text-gray-700">{{ props.label }}</label>
    <div class="flex items-center gap-3">
      <input
        type="color"
        :value="props.modelValue"
        class="h-10 w-12 cursor-pointer rounded-md border border-marble-300 bg-white p-1"
        @input="emit('update:modelValue', $event.target.value)"
      />
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="color in colors"
          :key="color"
          type="button"
          class="h-7 w-7 rounded-full border transition-transform hover:scale-110"
          :class="props.modelValue === color ? 'border-marble-900 ring-2 ring-marble-300' : 'border-white'"
          :style="{ backgroundColor: color }"
          @click="emit('update:modelValue', color)"
        />
      </div>
      <span class="ml-auto text-xs font-medium uppercase text-marble-500">{{ props.modelValue }}</span>
    </div>
  </div>
</template>
