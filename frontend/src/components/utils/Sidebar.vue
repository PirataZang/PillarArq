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
</script>

<template>
  <div class="relative lg:w-[88px] shrink-0 h-full">
    <!-- Desktop Invisible Overlay to catch outside clicks when open -->
    <div v-if="open" class="fixed inset-0 z-40 hidden lg:block" @click="emit('close')"></div>

    <!-- Mobile / Overlay Background -->
    <div v-if="open" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40 transition-opacity lg:hidden"
      @click="emit('close')"></div>

    <!-- Sidebar component -->
    <div :class="[
      open ? 'translate-x-0 w-[280px] shadow-2xl' : '-translate-x-full lg:translate-x-0 lg:w-[88px]',
      'fixed inset-y-0 left-0 z-50 bg-[#0f172a] transition-all duration-300 ease-in-out flex flex-col overflow-hidden'
    ]">
      <!-- Header / Toggle -->
      <div class="h-20 flex items-center shrink-0" :class="open ? 'px-6 justify-between' : 'justify-center'">
        <!-- Toggle Button -->
        <button @click="emit('toggle')"
          class="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl w-10 h-10 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0f172a]"
          :class="!open && 'mx-auto'">
          <i class="fa-solid fa-bars text-lg"></i>
        </button>

        <!-- Close Button (Mobile/Overlay) -->
        <button v-show="open" @click="emit('close')"
          class="lg:hidden text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg w-8 h-8 flex items-center justify-center transition-colors">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-2 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar" :class="open ? 'px-4' : 'px-0'">
        <template v-for="item in navigation" :key="item.id">

          <!-- Single Item -->
          <router-link v-if="!item.children" :to="item.href" :title="!open ? item.name : ''" :class="[
            isActive(item.href)
              ? 'bg-indigo-900/40 text-indigo-100'
              : 'text-gray-300 hover:bg-slate-800 hover:text-white',
            'group flex items-center py-3 text-sm font-medium rounded-xl transition-all duration-200',
            open ? 'px-4' : 'px-0 justify-center mx-4'
          ]" @click="!open ? emit('toggle') : null">
            <i
              :class="[isActive(item.href) ? 'text-indigo-400' : 'text-gray-400 group-hover:text-gray-300', item.icon, 'fa-fw flex-shrink-0 text-lg text-center transition-colors', open ? 'mr-4' : '']"></i>
            <span v-show="open" class="truncate transition-opacity duration-300 delay-100">{{ item.name }}</span>
          </router-link>

          <!-- Accordion Item -->
          <div v-else class="space-y-1 flex flex-col">
            <button @click="handleAccordionClick(item.id)" :title="!open ? item.name : ''" :class="[
              'group flex items-center py-3 text-sm font-medium rounded-xl transition-all duration-200',
              openMenus.includes(item.id) && open ? 'text-white' : 'text-gray-300 hover:bg-slate-800 hover:text-white',
              open ? 'px-4' : 'px-0 justify-center mx-4'
            ]">
              <i
                :class="[openMenus.includes(item.id) && open ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300', item.icon, 'fa-fw flex-shrink-0 text-lg text-center transition-colors', open ? 'mr-4' : '']"></i>
              <span v-show="open" class="truncate transition-opacity duration-300 delay-100 flex-1 text-left">{{ item.name }}</span>
              <i v-show="open" :class="[
                'fa-solid fa-chevron-down fa-fw text-xs text-gray-500 transition-transform duration-200 ml-2',
                openMenus.includes(item.id) ? 'rotate-180' : ''
              ]"></i>
            </button>

            <!-- Submenu Items -->
            <div v-show="openMenus.includes(item.id)" class="space-y-1 mt-1 mb-2" :class="open ? 'pl-4 pr-2' : 'px-0'">
              <router-link v-for="subItem in item.children" :key="subItem.id" :to="subItem.href" :title="!open ? subItem.name : ''" :class="[
                isActive(subItem.href)
                  ? 'bg-indigo-900/40 text-indigo-100'
                  : 'text-gray-400 hover:bg-slate-800/50 hover:text-white',
                'group flex items-center py-2.5 text-sm font-medium rounded-xl transition-all duration-200',
                open ? 'px-4' : 'px-0 justify-center mx-4'
              ]" @click="emit('close')">
                <i
                  :class="[isActive(subItem.href) ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300', subItem.icon, 'fa-fw flex-shrink-0 transition-colors', open ? 'mr-3 text-sm text-center' : 'text-lg text-center']"></i>
                <span v-show="open" class="truncate">{{ subItem.name }}</span>
              </router-link>
            </div>
          </div>

        </template>
      </nav>

      <!-- Footer / Company Select -->
      <div class="p-4 border-t border-slate-800 shrink-0">
        <div class="flex items-center bg-[#1e293b] rounded-xl p-1 border border-slate-700/50 overflow-hidden"
             :class="!open ? 'justify-center cursor-pointer hover:bg-slate-800' : ''"
             @click="!open ? emit('toggle') : null">
          <div class="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
            <i class="fa-solid fa-building text-gray-400 text-sm"></i>
          </div>
          <select v-show="open"
            class="w-full bg-transparent border-none text-gray-300 text-sm font-medium py-2 px-3 focus:outline-none focus:ring-0 appearance-none cursor-pointer">
            <option value="all" class="bg-slate-800">Todas as Empresas</option>
            <option value="debs" class="bg-slate-800">Debs</option>
            <option value="recrutamento" selected class="bg-slate-800">Recrutamento</option>
            <option value="padrao" class="bg-slate-800">Empresa Padrão</option>
          </select>
          <div v-show="open" class="pr-3 pointer-events-none text-gray-500">
            <i class="fa-solid fa-chevron-down text-xs"></i>
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
  background: #334155;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>
