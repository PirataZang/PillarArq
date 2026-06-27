<script setup>
const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  noPadding: { type: Boolean, default: false }
})
</script>

<template>
  <div class="bg-white overflow-hidden shadow-sm ring-1 ring-marble-200 rounded-lg">
    <!-- Header -->
    <div v-if="title || $slots.header || subtitle" class="px-4 py-5 sm:px-6 border-b border-marble-200 bg-white">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-base font-semibold leading-6 text-gray-900">
            <slot name="title">{{ title }}</slot>
          </h3>
          <p v-if="subtitle || $slots.subtitle" class="mt-1 max-w-2xl text-sm text-gray-500">
            <slot name="subtitle">{{ subtitle }}</slot>
          </p>
        </div>
        <div v-if="$slots.action">
          <slot name="action"></slot>
        </div>
      </div>
    </div>
    
    <!-- Body -->
    <div :class="[noPadding ? '' : 'px-4 py-5 sm:p-6']">
      <slot></slot>
    </div>

    <!-- Footer -->
    <div v-if="$slots.footer" class="px-4 py-4 sm:px-6 border-t border-marble-200 bg-marble-50">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
