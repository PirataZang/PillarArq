<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  error: { type: String, default: '' },
  helperText: { type: String, default: '' },
  rows: { type: [Number, String], default: 3 },
  maxlength: { type: [Number, String], default: null },
  minlength: { type: [Number, String], default: null }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'change'])

const id = `textarea-${Math.random().toString(36).substring(2, 9)}`

const hasError = computed(() => !!props.error)
</script>

<template>
  <div class="w-full flex flex-col gap-1.5">
    <label v-if="label" :for="id" class="text-sm font-medium text-gray-700 flex items-center">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1" aria-hidden="true">*</span>
    </label>

    <div class="relative">
      <textarea
        :id="id"
        :value="modelValue"
        :rows="rows"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :minlength="minlength"
        :aria-invalid="hasError"
        :aria-describedby="hasError ? `${id}-error` : helperText ? `${id}-helper` : null"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
        @change="$emit('change', $event)"
        class="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all duration-200 bg-white placeholder:text-gray-400"
        :class="[
          hasError 
            ? 'ring-red-300 focus:ring-red-500 text-red-900 placeholder:text-red-300' 
            : 'ring-gray-300 focus:ring-blue-600',
          disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : '',
          readonly && !disabled ? 'bg-gray-50 focus:ring-gray-300 cursor-default' : ''
        ]"
      ></textarea>
      <div v-if="error" class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 pt-3">
        <i class="fa-solid fa-circle-exclamation text-red-500"></i>
      </div>
    </div>

    <p v-if="hasError" :id="`${id}-error`" class="text-sm text-red-600 mt-1 animate-in fade-in slide-in-from-top-1">
      {{ error }}
    </p>
    <p v-else-if="helperText" :id="`${id}-helper`" class="text-sm text-gray-500 mt-1">
      {{ helperText }}
    </p>
  </div>
</template>
