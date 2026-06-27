<script setup>
import Loading from '@/components/utils/Loading.vue'
</script>

<template>
  <div class="min-h-screen bg-marble font-sans text-marble-900">
    <Loading />
    <router-view />
  </div>
</template>
