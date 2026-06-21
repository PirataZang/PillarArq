<script setup>
import Loading from '@/components/utils/Loading.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans text-gray-900">
    <Loading />
    <router-view />
  </div>
</template>
