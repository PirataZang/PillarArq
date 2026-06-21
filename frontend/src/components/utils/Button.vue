<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  icon: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'button'
  }
})

const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100'

const sizeClasses = computed(() => {
  if (props.icon) {
    // Para botões puramente de ícone
    return {
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-3'
    }[props.size]
  }
  
  return {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }[props.size]
})

const variantClasses = computed(() => {
  return {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 border border-transparent shadow-sm',
    secondary: 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm',
    success: 'bg-green-600 text-white hover:bg-green-700 border border-transparent shadow-sm',
    danger: 'bg-red-600 text-white hover:bg-red-700 border border-transparent shadow-sm',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 border border-transparent shadow-sm',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 border border-transparent'
  }[props.variant]
})

const widthClass = computed(() => props.fullWidth ? 'w-full' : '')
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[baseClasses, sizeClasses, variantClasses, widthClass]"
    v-bind="$attrs"
  >
    <i 
      v-if="loading" 
      class="fa-solid fa-circle-notch fa-spin -ml-1 mr-2" 
      :class="[size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-lg' : 'text-sm']" 
      aria-hidden="true" 
    ></i>
    
    <slot />
  </button>
</template>
