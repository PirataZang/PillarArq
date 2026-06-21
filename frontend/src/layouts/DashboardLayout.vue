<script setup>
import { ref } from 'vue'
import Sidebar from '@/components/utils/Sidebar.vue'
import Topbar from '@/components/utils/Topbar.vue'

const sidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <div class="h-screen flex overflow-hidden bg-gray-50">
    <!-- Sidebar -->
    <Sidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Main Content wrapper -->
    <div class="flex-1 flex flex-col w-0 overflow-hidden">
      <!-- Topbar -->
      <Topbar @toggle-sidebar="toggleSidebar" />

      <!-- Main Scrollable Area -->
      <main class="flex-1 relative z-0 overflow-y-auto focus:outline-none">
        <div class="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>
