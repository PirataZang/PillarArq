<script setup>
import { ref } from 'vue'
import Button from '@/components/utils/Button.vue'
import ActivityLogsModal from '@/components/audit/ActivityLogsModal.vue'

defineProps({
  subjectType: { type: String, required: true },
  subjectId: { type: [String, Number], default: null },
})

const showModal = ref(false)
</script>

<template>
  <Button
    v-if="subjectId"
    type="button"
    variant="secondary"
    size="sm"
    class="shrink-0 !border-sky-300 !text-sky-800 !bg-sky-50 hover:!bg-sky-100"
    @click="showModal = true"
  >
    <i class="fa-solid fa-clock-rotate-left mr-2"></i>
    Logs
  </Button>

  <ActivityLogsModal
    v-if="subjectId"
    v-model="showModal"
    :subject-type="subjectType"
    :subject-id="subjectId"
  />
</template>
