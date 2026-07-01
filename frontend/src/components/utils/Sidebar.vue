<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import api from '@/services/api'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'toggle', 'open'])
const route = useRoute()
const authStore = useAuthStore()

// Controle dos submenus abertos
const openMenus = ref(['finance', 'reports'])

const handleAccordionClick = (menuId) => {
  if (openMenus.value.includes(menuId)) {
    openMenus.value = openMenus.value.filter(id => id !== menuId)
  } else {
    openMenus.value.push(menuId)
  }
}

const isMaster = computed(() => !!authStore.user?.is_master)

const navigation = ref([
  { id: 'dashboard', name: 'Dashboard', href: '/dashboard', icon: 'fa-solid fa-chart-pie' },
  {
    id: 'buildings', name: 'Obras', icon: 'fa-solid fa-building', children: [
      { id: 'projects', name: 'Listagem', href: '/projects', icon: 'fa-solid fa-building', permission: 'projects.list' },
      { id: 'projects-kanban', name: 'Kanban', href: '/projects/kanban', icon: 'fa-solid fa-table-columns', permission: 'projects.list' },
    ]
  },
  { id: 'clients', name: 'Clientes', href: '/clients', icon: 'fa-solid fa-user-tie' },
  {
    id: 'reports',
    name: 'Relatórios',
    icon: 'fa-solid fa-chart-column',
    children: [
      {
        id: 'documents',
        name: 'Documentos',
        href: '/documents',
        icon: 'fa-solid fa-file-lines',
      },
      {
        id: 'budget-generate',
        name: 'Gerar orçamento',
        href: '/reports/budget',
        icon: 'fa-solid fa-file-invoice-dollar',
      },
    ],
  },
  { id: 'users', name: 'Usuários', href: '/users', icon: 'fa-solid fa-users', permission: 'user.list' },
  { id: 'settings', name: 'Configurações', href: '/settings', icon: 'fa-solid fa-gear' },
  // {
  //   id: 'finance', name: 'Financeiro', icon: 'fa-solid fa-dollar-sign',
  //   children: [
  //     { id: 'transactions', name: 'Transações', href: '/finance/transactions', icon: 'fa-solid fa-arrow-right-arrow-left', permission: 'transactions.list' },
  //     { id: 'categories', name: 'Categorias', href: '/finance/categories', icon: 'fa-solid fa-list', permission: 'categories.list' }
  //   ]
  // },
  { id: 'companies', name: 'Empresas', href: '/companies', icon: 'fa-solid fa-city', requiresMaster: true },
])

// Filtra a navegação dinamicamente de acordo com as permissões do usuário
const filteredNavigation = computed(() => {
  return navigation.value
    .map(item => {
      if (item.children) {
        const visibleChildren = item.children.filter(child => {
          if (child.permission) {
            return authStore.hasPermission(child.permission)
          }
          return true
        })
        return { ...item, children: visibleChildren }
      }
      return item
    })
    .filter(item => {
      if (item.requiresMaster) {
        return isMaster.value
      }
      if (item.permission) {
        return authStore.hasPermission(item.permission)
      }
      if (item.children) {
        // Mostra a categoria pai apenas se possuir pelo menos um filho visível
        return item.children.length > 0
      }
      return true
    })
})

const isActive = (href) => {
  if (href === '/') return route.path === '/'
  if (href === '/projects') return route.path.startsWith('/projects') && !route.path.startsWith('/projects/kanban')
  return route.path.startsWith(href)
}

const handleLinkClick = () => {
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    emit('close')
  }
}

// Lógica de Tenant Multi-Empresa para Masters
const companiesList = ref([])
const selectedCompanyId = ref(localStorage.getItem('selected_company_id') || authStore.user?.company_id)

onMounted(async () => {
  if (isMaster.value) {
    try {
      const { data } = await api.get('/companies')
      if (data && data.success) {
        companiesList.value = data.data

        // Se o selectedCompanyId não estiver na lista (por exemplo, se foi excluído), redefine
        const exists = companiesList.value.some(c => c.id === selectedCompanyId.value)
        if (!exists && companiesList.value.length > 0) {
          selectedCompanyId.value = companiesList.value[0].id
          localStorage.setItem('selected_company_id', selectedCompanyId.value)
        }
      }
    } catch (err) {
      console.error('Erro ao buscar empresas para o seletor:', err)
    }
  }
})

// Dropdown de Empresas Pesquisável
const showDropdown = ref(false)
const searchQuery = ref('')
const dropdownRef = ref(null)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
  if (showDropdown.value) {
    searchQuery.value = ''
  }
}

const filteredCompanies = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return companiesList.value
  return companiesList.value.filter(c => c.name.toLowerCase().includes(q))
})

const selectedCompany = computed(() => {
  return companiesList.value.find(c => c.id === selectedCompanyId.value) || { name: 'Pillar Arq' }
})

const selectCompany = (id) => {
  localStorage.setItem('selected_company_id', id)
  selectedCompanyId.value = id
  showDropdown.value = false
  window.location.reload()
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
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
        <template v-for="item in filteredNavigation" :key="item.id">

          <!-- Single Item -->
          <router-link v-if="!item.children" :to="item.href" :class="[
            isActive(item.href)
              ? 'bg-white/8 text-white border-l-2 border-l-orange-500'
              : 'text-marble-300 hover:bg-charcoal-light hover:text-white',
            'group relative flex items-center h-12 text-sm font-medium rounded-xl transition-all duration-300 px-3 mx-4'
          ]" @click="handleLinkClick">
            <span class="w-8 h-8 flex items-center justify-center shrink-0">
              <i
                :class="[isActive(item.href) ? 'text-marble-200' : 'text-marble-500 group-hover:text-marble-300', item.icon, 'fa-fw text-lg text-center transition-colors']"></i>
            </span>
            <span :class="[
              open ? 'opacity-100 max-w-[200px] ml-3' : 'opacity-0 max-w-0 overflow-hidden',
              'transition-all duration-300 ease-in-out whitespace-nowrap truncate'
            ]">{{ item.name }}</span>

            <!-- Tooltip -->
            <div v-if="!open"
              class="absolute left-full ml-4 px-2.5 py-1.5 bg-charcoal text-marble-100 text-xs font-semibold rounded-lg shadow-md border border-charcoal-border pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
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
                <i
                  :class="[openMenus.includes(item.id) && open ? 'text-marble-200' : 'text-marble-500 group-hover:text-marble-300', item.icon, 'fa-fw text-lg text-center transition-colors']"></i>
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
              <div v-if="!open"
                class="absolute left-full ml-4 px-2.5 py-1.5 bg-charcoal text-marble-100 text-xs font-semibold rounded-lg shadow-md border border-charcoal-border pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
                {{ item.name }}
              </div>
            </button>

            <!-- Submenu Items -->
            <div v-show="openMenus.includes(item.id) && open"
              class="space-y-1 mt-1 mb-2 transition-all duration-300 ease-in-out" :class="open ? 'pl-4' : 'pl-0'">
              <router-link v-for="subItem in item.children" :key="subItem.id" :to="subItem.href"
                :title="!open ? subItem.name : ''" :class="[
                  isActive(subItem.href)
                    ? 'bg-white/8 text-white border-l-2 border-l-orange-500'
                    : 'text-marble-400 hover:bg-charcoal-light/80 hover:text-white',
                  'group flex items-center h-10 text-sm font-medium rounded-xl transition-all duration-300 px-3 mx-4'
                ]" @click="handleLinkClick">
                <span class="w-8 h-8 flex items-center justify-center shrink-0">
                  <i
                    :class="[isActive(subItem.href) ? 'text-marble-200' : 'text-marble-500 group-hover:text-marble-300', subItem.icon, 'fa-fw text-base text-center transition-colors']"></i>
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
      <div v-if="isMaster" ref="dropdownRef"
        class="p-4 border-t border-charcoal-border shrink-0 flex justify-center relative">
        <!-- Dropdown Panel (Opens upward if sidebar is open, or as popover if closed) -->
        <div v-if="showDropdown" :class="[
          open
            ? 'bottom-full mb-2 left-4 right-4 w-[calc(100%-2rem)]'
            : 'left-full bottom-4 ml-3 w-64'
        ]"
          class="absolute z-50 bg-charcoal-light border border-charcoal-border rounded-xl p-3 shadow-xl flex flex-col gap-2">

          <!-- Search Field -->
          <div class="relative">
            <input v-model="searchQuery" type="text" placeholder="Pesquisar empresa..."
              class="w-full bg-charcoal border border-charcoal-border rounded-lg text-xs py-2 pl-8 pr-3 text-white placeholder-marble-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              @click.stop />
            <div class="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-marble-500">
              <i class="fa-solid fa-magnifying-glass text-[10px]"></i>
            </div>
            <button v-if="searchQuery" @click.stop="searchQuery = ''"
              class="absolute inset-y-0 right-0 flex items-center pr-2.5 text-marble-500 hover:text-white">
              <i class="fa-solid fa-xmark text-[10px]"></i>
            </button>
          </div>

          <!-- List of Companies -->
          <div class="max-h-48 overflow-y-auto space-y-1 custom-scrollbar pr-1">
            <template v-if="filteredCompanies.length > 0">
              <button v-for="company in filteredCompanies" :key="company.id" @click.stop="selectCompany(company.id)"
                class="w-full text-left text-xs font-medium py-2 px-3 rounded-lg hover:bg-white/5 transition-colors text-marble-300 hover:text-white flex items-center justify-between"
                :class="selectedCompanyId === company.id ? 'bg-orange-500/10 text-orange-400 font-semibold border-l-2 border-l-orange-500 rounded-l-none' : ''">
                <span class="truncate">{{ company.name }}</span>
                <i v-if="selectedCompanyId === company.id"
                  class="fa-solid fa-check text-[10px] text-orange-400 ml-2"></i>
              </button>
            </template>
            <div v-else class="text-[11px] text-marble-500 py-3 text-center">
              Nenhuma empresa encontrada
            </div>
          </div>
        </div>

        <!-- Clickable Selector -->
        <div @click.stop="toggleDropdown"
          class="group relative flex items-center bg-charcoal-light hover:bg-charcoal-light/80 rounded-xl p-1 border border-charcoal-border cursor-pointer select-none transition-all duration-300 w-full"
          :class="open ? 'max-w-full' : 'max-w-12 justify-center'">
          <div class="w-10 h-10 rounded-lg bg-charcoal-muted flex items-center justify-center shrink-0">
            <i class="fa-solid fa-building text-marble-400 text-sm"></i>
          </div>
          <div :class="[
            open ? 'opacity-100 max-w-xs ml-2 flex items-center flex-1' : 'opacity-0 max-w-0 overflow-hidden pointer-events-none'
          ]" class="transition-all duration-300 ease-in-out flex items-center justify-between w-full pr-2">
            <span class="text-marble-300 text-sm font-medium truncate pr-1">
              {{ selectedCompany.name }}
            </span>
            <div class="text-gray-500 shrink-0">
              <i class="fa-solid fa-chevron-down text-xs transition-transform duration-200"
                :class="showDropdown ? 'rotate-180' : ''"></i>
            </div>
          </div>

          <!-- Tooltip (Only if sidebar is closed and dropdown is closed) -->
          <div v-if="!open && !showDropdown"
            class="absolute left-full ml-4 px-2.5 py-1.5 bg-charcoal text-marble-100 text-xs font-semibold rounded-lg shadow-md border border-charcoal-border pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
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
