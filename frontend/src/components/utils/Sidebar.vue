<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])
const route = useRoute()

const navigation = [
  { id: 'dashboard', name: 'Dashboard', href: '/dashboard' },
  { id: 'users', name: 'Usuários', href: '/users' },
  { id: 'settings', name: 'Configurações', href: '/settings' },
]

const isActive = (href) => route.path.startsWith(href)
</script>

<template>
  <div>
    <!-- Mobile overlay -->
    <div 
      v-if="open" 
      class="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
      @click="emit('close')"
    ></div>

    <!-- Sidebar component -->
    <div 
      :class="[
        open ? 'translate-x-0' : '-translate-x-full',
        'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col'
      ]"
    >
      <!-- Header -->
      <div class="h-16 flex items-center px-6 border-b border-gray-200 justify-between">
        <div class="flex items-center gap-3">
          <div class="bg-blue-600 p-1.5 rounded-lg flex items-center justify-center w-8 h-8">
            <i class="fa-solid fa-building text-white"></i>
          </div>
          <span class="text-lg font-semibold text-gray-900 tracking-tight">PillarARQ</span>
        </div>
        <button @click="emit('close')" class="lg:hidden text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center">
          <i class="fa-solid fa-xmark text-xl"></i>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <router-link
          v-for="item in navigation"
          :key="item.id"
          :to="item.href"
          :class="[
            isActive(item.href) 
              ? 'bg-gray-50 text-blue-600' 
              : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600',
            'group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors'
          ]"
        >
          <i v-if="item.id === 'dashboard'" :class="[ isActive(item.href) ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600', 'fa-solid fa-house flex-shrink-0 -ml-1 mr-3 text-lg transition-colors w-5 text-center' ]"></i>
          <i v-if="item.id === 'users'" :class="[ isActive(item.href) ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600', 'fa-solid fa-users flex-shrink-0 -ml-1 mr-3 text-lg transition-colors w-5 text-center' ]"></i>
          <i v-if="item.id === 'settings'" :class="[ isActive(item.href) ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600', 'fa-solid fa-gear flex-shrink-0 -ml-1 mr-3 text-lg transition-colors w-5 text-center' ]"></i>
          {{ item.name }}
        </router-link>
      </nav>

      <!-- Footer/User profile (opcional) -->
      <div class="p-4 border-t border-gray-200">
        <div class="flex items-center gap-3 px-2">
          <div class="w-8 h-8 rounded-full bg-gray-100 border border-gray-200"></div>
          <div class="flex flex-col">
            <span class="text-sm font-medium text-gray-900">Admin</span>
            <span class="text-xs text-gray-500">admin@pillararq.com</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
