import { createRouter, createWebHistory } from 'vue-router'

// Exemplo de componente direto, mas você pode usar arquivos separados como HomeView.vue
const Home = { template: '<div class="text-center p-4">Bem-vindo à Página Inicial (Vue Router)!</div>' }

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    }
  ]
})

export default router
