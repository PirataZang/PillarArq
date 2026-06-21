import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const token = useStorage('auth_token', null)
  const refreshTokenKey = useStorage('auth_refresh_token', null)
  const user = useStorage('auth_user', null, sessionStorage) // Ou localStorage se preferir
  
  // Getters
  const isAuthenticated = computed(() => !!token.value)

  // Ações
  async function login(credentials) {
    const { data } = await api.post('/login', credentials)
    
    // Supondo que a API retorna o token e o usuário
    token.value = data.token
    if (data.refreshToken) {
      refreshTokenKey.value = data.refreshToken
    }
    user.value = data.user
  }

  function logout() {
    token.value = null
    refreshTokenKey.value = null
    user.value = null
    // Redirecionamento pode ser feito no componente ou router
  }

  async function me() {
    try {
      const { data } = await api.get('/me')
      user.value = data
    } catch (error) {
      logout()
    }
  }

  async function refreshToken() {
    if (!refreshTokenKey.value) return false
    
    try {
      const { data } = await api.post('/refresh', {
        refresh_token: refreshTokenKey.value
      })
      token.value = data.token
      return true
    } catch (error) {
      logout()
      return false
    }
  }

  return { 
    token, 
    refreshTokenKey, 
    user, 
    isAuthenticated, 
    login, 
    logout, 
    me, 
    refreshToken 
  }
})
