<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
    <h1 class="text-4xl font-bold text-blue-600 mb-8">Vue 3 + Tailwind CSS v4!</h1>
    
    <!-- Area do Vue Router -->
    <div class="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
      <router-view />
    </div>
  </div>
</template>
