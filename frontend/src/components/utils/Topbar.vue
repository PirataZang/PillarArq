<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

defineProps({
  sidebarOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggleSidebar'])
const authStore = useAuthStore()

const userName = computed(() => authStore.user?.name ?? 'Usuário')
const userRole = computed(() => authStore.user?.role ?? '')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())
</script>

<template>
  <header class="h-16 flex items-center justify-between px-6 bg-white/90 backdrop-blur-sm border-b border-marble-200 shrink-0">
    <!-- Left side -->
    <div class="flex items-center flex-1">
      <button @click="emit('toggleSidebar')"
        class="lg:hidden text-marble-600 hover:text-marble-900 focus:outline-none rounded-md mr-4">
        <i class="fa-solid fa-bars text-xl"></i>
      </button>
    </div>

    <!-- Right side -->
    <div class="flex items-center space-x-6">
      <button class="text-marble-400 hover:text-marble-700 transition-colors relative focus:outline-none">
        <i class="fa-solid fa-bell text-lg"></i>
        <span class="absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full bg-marble-600 ring-2 ring-white"></span>
      </button>

      <div class="h-8 w-[1px] bg-marble-200"></div>

      <div class="flex items-center gap-3 cursor-pointer group">
        <div class="flex flex-col items-end">
          <span class="text-sm font-semibold text-marble-900">{{ userName }}</span>
          <span class="text-xs text-marble-500 capitalize">{{ userRole }}</span>
        </div>
        <div class="h-10 w-10 rounded-full bg-charcoal flex items-center justify-center text-marble-100 font-bold shadow-sm group-hover:ring-2 group-hover:ring-marble-400 group-hover:ring-offset-2 transition-all">
          {{ userInitial }}
        </div>
        <i class="fa-solid fa-chevron-down text-gray-400 text-xs ml-1 group-hover:text-gray-600 transition-colors"></i>
      </div>
    </div>
  </header>
</template>
