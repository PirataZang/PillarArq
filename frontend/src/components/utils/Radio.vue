<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number, Boolean], default: '' },
  value: { type: [String, Number, Boolean], required: true },
  label: { type: String, default: '' },
  description: { type: String, default: '' },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'change'])
const id = `radio-${Math.random().toString(36).substring(2, 9)}`

const isChecked = computed(() => props.modelValue === props.value)

const handleChange = () => {
  if (props.disabled) return
  emit('update:modelValue', props.value)
  emit('change', props.value)
}
</script>

<template>
  <div class="relative flex items-start">
    <div class="flex h-6 items-center">
      <input
        :id="id"
        type="radio"
        :checked="isChecked"
        :disabled="disabled"
        :value="value"
        @change="handleChange"
        class="h-4 w-4 border-marble-300 text-marble-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      />
    </div>
    <div class="ml-3 text-sm leading-6">
      <label :for="id" class="font-medium text-gray-900 cursor-pointer" :class="disabled ? 'text-gray-400 cursor-not-allowed' : ''">
        <slot name="label">{{ label }}</slot>
      </label>
      <p v-if="description || $slots.description" :id="`${id}-description`" class="text-gray-500">
        <slot name="description">{{ description }}</slot>
      </p>
    </div>
  </div>
</template>
