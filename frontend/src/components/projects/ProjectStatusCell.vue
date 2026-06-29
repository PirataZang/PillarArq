<script setup>
import { computed } from 'vue'
import { PROJECT_STATUS_LABELS } from '@/utils/projectLabels'

const props = defineProps({
  params: { type: Object, required: true },
})

const status = computed(() => props.params?.value ?? '')

const label = computed(() => PROJECT_STATUS_LABELS[status.value] ?? status.value)

const badgeClass = computed(() => {
  const map = {
    DRAFT: 'bg-marble-100 text-marble-700 ring-marble-200',
    BUDGETING: 'bg-sky-50 text-sky-700 ring-sky-200',
    IN_PROGRESS: 'bg-amber-50 text-amber-700 ring-amber-200',
    ON_HOLD: 'bg-orange-50 text-orange-700 ring-orange-200',
    COMPLETED: 'bg-green-50 text-green-700 ring-green-200',
    ARCHIVED: 'bg-marble-100 text-marble-500 ring-marble-200',
  }
  return map[status.value] ?? 'bg-marble-100 text-marble-700 ring-marble-200'
})
</script>

<template>
  <div class="flex items-center h-full">
    <span
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset whitespace-nowrap"
      :class="badgeClass"
    >
      {{ label }}
    </span>
  </div>
</template>
