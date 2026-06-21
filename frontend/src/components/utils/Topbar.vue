<script setup>
import Breadcrumb from './Breadcrumb.vue'

defineProps({
  sidebarOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggleSidebar'])
</script>

<template>
  <header class="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200">
    <!-- Left side -->
    <div class="flex items-center flex-1">
      <button @click="emit('toggleSidebar')"
        class="lg:hidden text-gray-500 hover:text-gray-900 focus:outline-none rounded-md mr-4">
        <i class="fa-solid fa-bars text-xl"></i>
      </button>
      <div class="hidden sm:block">
        <Breadcrumb />
      </div>
    </div>

    <!-- Right side -->
    <div class="flex items-center space-x-4">
      <button class="text-gray-400 hover:text-gray-600 transition-colors">
        <i class="fa-solid fa-magnifying-glass"></i>
      </button>
      <button class="text-gray-400 hover:text-gray-600 transition-colors relative">
        <i class="fa-regular fa-bell"></i>
        <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
      </button>

      <div
        class="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
        <i class="fa-solid fa-user text-gray-600 text-sm"></i>
      </div>
    </div>
  </header>
</template>
