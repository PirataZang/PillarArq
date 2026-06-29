<script setup>
import { computed } from 'vue'

const props = defineProps({
  params: { type: Object, required: true },
})

const percent = computed(() => Number(props.params?.value ?? 0))

const barColor = computed(() => {
  const value = percent.value
  if (value >= 75) return '#16a34a'
  if (value >= 40) return '#d97706'
  return '#3b82f6'
})
</script>

<template>
  <div class="flex flex-col justify-center h-full gap-1 py-2 min-w-[120px]">
    <span class="text-xs font-semibold text-marble-700 tabular-nums">{{ percent }}%</span>
    <div class="w-full h-1.5 bg-marble-200 rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-300"
        :style="{ width: `${Math.min(100, percent)}%`, backgroundColor: barColor }"
      ></div>
    </div>
  </div>
</template>
