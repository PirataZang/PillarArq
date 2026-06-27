<script setup>
import Card from '@/components/utils/Card.vue'

const stats = [
  { id: 'projects', name: 'Total de Projetos', stat: '71', change: '12%', changeType: 'increase' },
  { id: 'clients', name: 'Clientes Ativos', stat: '24', change: '5.4%', changeType: 'increase' },
  { id: 'conversion', name: 'Taxa de Conversão', stat: '24.57%', change: '3.2%', changeType: 'decrease' },
  { id: 'revenue', name: 'Receita Mensal', stat: 'R$ 145.000', change: '14.5%', changeType: 'increase' },
]
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-marble-900 tracking-tight">Dashboard</h1>
      <p class="mt-1 text-sm text-marble-600">Visão geral do seu escritório.</p>
    </div>

    <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="item in stats"
        :key="item.id"
        class="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow-sm ring-1 ring-marble-200 sm:px-6 sm:pt-6 transition-all hover:shadow-md hover:ring-marble-300"
      >
        <dt>
          <div class="absolute rounded-md bg-marble-100 p-3">
            <i v-if="item.id === 'projects'" class="fa-solid fa-building text-marble-700 text-xl" aria-hidden="true"></i>
            <i v-if="item.id === 'clients'" class="fa-solid fa-users text-marble-700 text-xl" aria-hidden="true"></i>
            <i v-if="item.id === 'conversion'" class="fa-solid fa-chart-line text-marble-700 text-xl" aria-hidden="true"></i>
            <i v-if="item.id === 'revenue'" class="fa-solid fa-dollar-sign text-marble-700 text-xl" aria-hidden="true"></i>
          </div>
          <p class="ml-16 truncate text-sm font-medium text-marble-600">{{ item.name }}</p>
        </dt>
        <dd class="ml-16 flex items-baseline pb-6 sm:pb-7">
          <p class="text-2xl font-semibold text-marble-900">{{ item.stat }}</p>
          <p
            :class="[
              item.changeType === 'increase' ? 'text-green-700' : 'text-red-700',
              'ml-2 flex items-baseline text-sm font-semibold'
            ]"
          >
            {{ item.changeType === 'increase' ? '+' : '-' }}{{ item.change }}
          </p>
        </dd>
      </div>
    </dl>

    <div class="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
      <Card title="Projetos Recentes">
        <div class="h-64 flex items-center justify-center text-marble-400 border-2 border-dashed border-marble-200 rounded-md bg-marble-50">
          Gráfico ou Tabela de Projetos
        </div>
      </Card>

      <Card title="Atividades Recentes">
        <div class="h-64 flex items-center justify-center text-marble-400 border-2 border-dashed border-marble-200 rounded-md bg-marble-50">
          Timeline de Atividades
        </div>
      </Card>
    </div>
  </div>
</template>
