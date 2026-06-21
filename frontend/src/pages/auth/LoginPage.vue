<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import Card from '@/components/utils/Card.vue'
import Input from '@/components/utils/Input.vue'
import Button from '@/components/utils/Button.vue'
import Checkbox from '@/components/utils/Checkbox.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  
  try {
    // Simulando login se a API não estiver pronta
    // await authStore.login(form)
    
    // Mock forzando sucesso para testes visuais:
    authStore.token = 'mock_token_123'
    authStore.user = { name: 'Admin', email: form.email }
    
    router.push('/dashboard')
  } catch (err) {
    error.value = err.response?.data?.message || 'E-mail ou senha inválidos'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full">
    <div class="sm:mx-auto sm:w-full sm:max-w-md mb-8 flex flex-col items-center">
        <div class="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <i class="fa-solid fa-building text-white text-2xl"></i>
        </div>
      <h2 class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Acesse sua conta
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Gestão para Escritórios de Arquitetura e Engenharia
      </p>
    </div>

    <Card class="shadow-xl shadow-gray-200/50 border-gray-100">
      <form @submit.prevent="handleLogin" class="space-y-6">
        
        <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center border border-red-100">
          {{ error }}
        </div>

        <Input
          v-model="form.email"
          label="E-mail corporativo"
          type="email"
          placeholder="voce@escritorio.com"
          required
        />

        <Input
          v-model="form.password"
          label="Senha"
          type="password"
          placeholder="••••••••"
          required
        />

        <div class="flex items-center justify-between">
          <Checkbox v-model="form.remember" label="Lembrar-me" />
          
          <div class="text-sm leading-6">
            <a href="#" class="font-medium text-blue-600 hover:text-blue-500">Esqueceu a senha?</a>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          class="w-full py-2.5"
          :loading="loading"
        >
          Entrar no sistema
        </Button>
      </form>
    </Card>
  </div>
</template>
