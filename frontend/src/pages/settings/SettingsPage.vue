<script setup>
import { ref, computed } from 'vue'
import { settingsTabs } from '@/pages/settings/settingsTabs'

const activeTab = ref(settingsTabs[0].id)

const activeTabConfig = computed(() =>
  settingsTabs.find((tab) => tab.id === activeTab.value) ?? settingsTabs[0]
)
</script>

<template>
  <div>
    <div class="mb-5">
      <h1 class="text-2xl font-bold text-marble-900 tracking-tight">Configurações</h1>
      <p class="mt-1 text-sm text-marble-600">
        Ajuste as configurações da empresa disponíveis para o seu time.
      </p>
    </div>

    <div class="border-b border-marble-200 mb-4">
      <nav class="flex gap-1 overflow-x-auto">
        <button
          v-for="tab in settingsTabs"
          :key="tab.id"
          type="button"
          class="flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
          :class="
            activeTab === tab.id
              ? 'border-charcoal text-marble-900'
              : 'border-transparent text-marble-500 hover:text-marble-700'
          "
          @click="activeTab = tab.id"
        >
          <i :class="['fa-solid', tab.icon]"></i>
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <div class="max-w-7xl mx-auto">
      <component :is="activeTabConfig.component" />
    </div>
  </div>
</template>
