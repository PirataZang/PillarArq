<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: '' },
  description: { type: String, default: '' },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'change'])

const id = `switch-${Math.random().toString(36).substring(2, 9)}`

const toggle = () => {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
  emit('change', !props.modelValue)
}
</script>

<template>
  <div class="flex items-start gap-3">
    <button
      type="button"
      :id="id"
      :aria-checked="modelValue"
      :disabled="disabled"
      @click="toggle"
      class="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      :class="modelValue ? 'bg-marble-700' : 'bg-marble-300'"
    >
      <span
        aria-hidden="true"
        class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
        :class="modelValue ? 'translate-x-4' : 'translate-x-0'"
      ></span>
    </button>
    <div class="flex flex-col">
      <label v-if="label" :for="id" class="text-sm font-medium text-gray-900 cursor-pointer" :class="disabled ? 'text-gray-400 cursor-not-allowed' : ''" @click="toggle">
        {{ label }}
      </label>
      <span v-if="description" class="text-sm text-gray-500">
        {{ description }}
      </span>
    </div>
  </div>
</template>
