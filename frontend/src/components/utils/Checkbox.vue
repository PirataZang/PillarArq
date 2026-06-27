<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [Boolean, Array], default: false },
  value: { type: [String, Number, Boolean, Object], default: null },
  label: { type: String, default: '' },
  description: { type: String, default: '' },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'change'])
const id = `checkbox-${Math.random().toString(36).substring(2, 9)}`

const isChecked = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.includes(props.value)
  }
  return !!props.modelValue
})

const handleChange = (event) => {
  const checked = event.target.checked
  
  if (Array.isArray(props.modelValue)) {
    const newValue = [...props.modelValue]
    if (checked) {
      newValue.push(props.value)
    } else {
      const index = newValue.indexOf(props.value)
      if (index > -1) newValue.splice(index, 1)
    }
    emit('update:modelValue', newValue)
    emit('change', newValue)
  } else {
    emit('update:modelValue', checked)
    emit('change', checked)
  }
}
</script>

<template>
  <div class="relative flex items-start">
    <div class="flex h-6 items-center">
      <input
        :id="id"
        type="checkbox"
        :checked="isChecked"
        :disabled="disabled"
        :value="value"
        @change="handleChange"
        class="h-4 w-4 rounded border-marble-300 text-marble-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
