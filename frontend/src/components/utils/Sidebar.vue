<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'toggle', 'open'])
const route = useRoute()

// Controle dos submenus abertos
const openMenus = ref(['finance'])

const handleAccordionClick = (menuId) => {
  if (openMenus.value.includes(menuId)) {
    openMenus.value = openMenus.value.filter(id => id !== menuId)
  } else {
    openMenus.value.push(menuId)
  }
}

const navigation = ref([
  { id: 'dashboard', name: 'Dashboard', href: '/dashboard', icon: 'fa-solid fa-chart-pie' },
  { id: 'projects', name: 'Obras', href: '/projects', icon: 'fa-solid fa-building' },
  { id: 'clients', name: 'Clientes', href: '/clients', icon: 'fa-solid fa-user-tie' },
  { id: 'users', name: 'Usuários', href: '/users', icon: 'fa-solid fa-users' },
  {
    id: 'finance', name: 'Financeiro', icon: 'fa-solid fa-dollar-sign',
    children: [
      { id: 'transactions', name: 'Transações', href: '/finance/transactions', icon: 'fa-solid fa-arrow-right-arrow-left' },
      { id: 'categories', name: 'Categorias', href: '/finance/categories', icon: 'fa-solid fa-list' }
    ]
  },
])

const isActive = (href) => {
  if (href === '/') return route.path === '/'
  return route.path.startsWith(href)
}

const handleLinkClick = () => {
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    emit('close')
  }
}
</script>

<template>
  <div :class="[
    open ? 'lg:w-[280px]' : 'lg:w-[88px]',
    'relative shrink-0 h-full transition-all duration-300 ease-in-out'
  ]">
    <!-- Desktop Invisible Overlay to catch outside clicks when open -->
    <div v-if="open" class="fixed inset-0 z-40 hidden lg:block" @click="emit('close')"></div>

    <!-- Mobile / Overlay Background -->
    <div v-if="open" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40 transition-opacity lg:hidden"
      @click="emit('close')"></div>

    <!-- Sidebar component -->
    <div :class="[
      open ? 'translate-x-0 w-[280px] shadow-2xl' : '-translate-x-full lg:translate-x-0 lg:w-[88px]',
      'fixed inset-y-0 left-0 z-50 bg-charcoal transition-all duration-300 ease-in-out flex flex-col overflow-hidden'
    ]">
      <!-- Header / Toggle -->
      <div class="h-20 flex items-center shrink-0 px-6 w-full">
        <!-- Toggle Button -->
        <button @click="emit('toggle')"
          class="bg-marble-700 hover:bg-marble-600 text-white rounded-xl w-10 h-10 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-marble-400 focus:ring-offset-2 focus:ring-offset-charcoal shrink-0">
          <i class="fa-solid fa-bars text-lg"></i>
        </button>

        <!-- Close Button (Mobile/Overlay) -->
        <button v-show="open" @click="emit('close')"
          class="lg:hidden text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg w-8 h-8 flex items-center justify-center transition-colors ml-auto shrink-0">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-2 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar px-0">
        <template v-for="item in navigation" :key="item.id">

          <!-- Single Item -->
          <router-link v-if="!item.children" :to="item.href" :class="[
            isActive(item.href)
              ? 'bg-white/8 text-white border-l-2 border-l-marble-400'
              : 'text-marble-300 hover:bg-charcoal-light hover:text-white',
            'group relative flex items-center h-12 text-sm font-medium rounded-xl transition-all duration-300 px-3 mx-4'
          ]" @click="handleLinkClick">
            <span class="w-8 h-8 flex items-center justify-center shrink-0">
              <i :class="[isActive(item.href) ? 'text-marble-200' : 'text-marble-500 group-hover:text-marble-300', item.icon, 'fa-fw text-lg text-center transition-colors']"></i>
            </span>
            <span :class="[
              open ? 'opacity-100 max-w-[200px] ml-3' : 'opacity-0 max-w-0 overflow-hidden',
              'transition-all duration-300 ease-in-out whitespace-nowrap truncate'
            ]">{{ item.name }}</span>

            <!-- Tooltip -->
            <div v-if="!open" class="absolute left-full ml-4 px-2.5 py-1.5 bg-charcoal text-marble-100 text-xs font-semibold rounded-lg shadow-md border border-charcoal-border pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
              {{ item.name }}
            </div>
          </router-link>

          <!-- Accordion Item -->
          <div v-else class="space-y-1 flex flex-col">
            <button @click="handleAccordionClick(item.id)" :class="[
              'group relative flex items-center h-12 text-sm font-medium rounded-xl transition-all duration-300 px-3 mx-4',
              openMenus.includes(item.id) && open ? 'text-white' : 'text-marble-300 hover:bg-charcoal-light hover:text-white',
            ]">
              <span class="w-8 h-8 flex items-center justify-center shrink-0">
                <i :class="[openMenus.includes(item.id) && open ? 'text-marble-200' : 'text-marble-500 group-hover:text-marble-300', item.icon, 'fa-fw text-lg text-center transition-colors']"></i>
              </span>
              <span :class="[
                open ? 'opacity-100 max-w-[200px] ml-3' : 'opacity-0 max-w-0 overflow-hidden',
                'transition-all duration-300 ease-in-out whitespace-nowrap truncate flex-1 text-left'
              ]">{{ item.name }}</span>
              <i :class="[
                'fa-solid fa-chevron-down fa-fw text-xs text-gray-500 transition-all duration-300 ml-2 shrink-0',
                open ? 'opacity-100 scale-100' : 'opacity-0 scale-0 w-0 overflow-hidden',
                openMenus.includes(item.id) ? 'rotate-180' : ''
              ]"></i>

              <!-- Tooltip -->
              <div v-if="!open" class="absolute left-full ml-4 px-2.5 py-1.5 bg-charcoal text-marble-100 text-xs font-semibold rounded-lg shadow-md border border-charcoal-border pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
                {{ item.name }}
              </div>
            </button>

            <!-- Submenu Items -->
            <div v-show="openMenus.includes(item.id) && open" class="space-y-1 mt-1 mb-2 transition-all duration-300 ease-in-out" :class="open ? 'pl-4' : 'pl-0'">
              <router-link v-for="subItem in item.children" :key="subItem.id" :to="subItem.href" :title="!open ? subItem.name : ''" :class="[
                isActive(subItem.href)
                  ? 'bg-white/8 text-white border-l-2 border-l-marble-400'
                  : 'text-marble-400 hover:bg-charcoal-light/80 hover:text-white',
                'group flex items-center h-10 text-sm font-medium rounded-xl transition-all duration-300 px-3 mx-4'
              ]" @click="handleLinkClick">
                <span class="w-8 h-8 flex items-center justify-center shrink-0">
                  <i :class="[isActive(subItem.href) ? 'text-marble-200' : 'text-marble-500 group-hover:text-marble-300', subItem.icon, 'fa-fw text-base text-center transition-colors']"></i>
                </span>
                <span :class="[
                  open ? 'opacity-100 max-w-[200px] ml-3' : 'opacity-0 max-w-0 overflow-hidden',
                  'transition-all duration-300 ease-in-out whitespace-nowrap truncate'
                ]">{{ subItem.name }}</span>
              </router-link>
            </div>
          </div>

        </template>
      </nav>

      <!-- Footer / Company Select -->
      <div class="p-4 border-t border-charcoal-border shrink-0 flex justify-center">
        <div class="group relative flex items-center bg-charcoal-light rounded-xl p-1 border border-charcoal-border overflow-hidden transition-all duration-300 w-full"
             :class="open ? 'max-w-full' : 'max-w-12 justify-center border-charcoal-border'">
          <div class="w-10 h-10 rounded-lg bg-charcoal-muted flex items-center justify-center shrink-0">
            <i class="fa-solid fa-building text-marble-400 text-sm"></i>
          </div>
          <div :class="[
            open ? 'opacity-100 max-w-xs ml-2 flex items-center flex-1' : 'opacity-0 max-w-0 overflow-hidden pointer-events-none'
          ]" class="transition-all duration-300 ease-in-out flex items-center w-full">
            <select
              class="w-full bg-transparent border-none text-marble-300 text-sm font-medium py-2 pl-1 pr-6 focus:outline-none focus:ring-0 appearance-none cursor-pointer">
              <option value="all" class="bg-charcoal-light">Todas as Empresas</option>
              <option value="debs" class="bg-charcoal-light">Debs</option>
              <option value="recrutamento" selected class="bg-charcoal-light">Recrutamento</option>
              <option value="padrao" class="bg-charcoal-light">Empresa Padrão</option>
            </select>
            <div class="pointer-events-none text-gray-500 shrink-0 pr-2">
              <i class="fa-solid fa-chevron-down text-xs"></i>
            </div>
          </div>

          <!-- Tooltip -->
          <div v-if="!open" class="absolute left-full ml-4 px-2.5 py-1.5 bg-charcoal text-marble-100 text-xs font-semibold rounded-lg shadow-md border border-charcoal-border pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
            Empresas
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #5c5852;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #7a746c;
}
</style>
