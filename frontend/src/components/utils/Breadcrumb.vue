<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => [
      { label: 'Home', href: '/' },
      { label: 'Dashboard', href: '/dashboard' }
    ]
  }
})
</script>

<template>
  <nav class="flex text-sm text-gray-500 font-medium space-x-2 items-center">
    <template v-for="(item, index) in items" :key="index">
      <router-link 
        v-if="item.href" 
        :to="item.href" 
        class="hover:text-gray-900 transition-colors"
      >
        {{ item.label }}
      </router-link>
      <span v-else class="text-gray-900">{{ item.label }}</span>
      
      <i v-if="index < items.length - 1" class="fa-solid fa-chevron-right text-gray-400 text-xs"></i>
    </template>
  </nav>
</template>
