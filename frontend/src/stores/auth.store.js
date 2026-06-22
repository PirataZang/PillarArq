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
    const response = await api.post('/auth/login', credentials)
    const result = response.data.data
    
    token.value = result.access_token
    if (result.refresh_token) {
      refreshTokenKey.value = result.refresh_token
    }
    
    await me()
  }

  function logout() {
    token.value = null
    refreshTokenKey.value = null
    user.value = null
  }

  async function me() {
    try {
      const response = await api.get('/auth/me')
      user.value = response.data.data
    } catch (error) {
      logout()
    }
  }

  async function refreshToken() {
    if (!refreshTokenKey.value) return false
    
    try {
      const response = await api.post('/auth/refresh', {
        refresh_token: refreshTokenKey.value
      })
      const result = response.data.data
      token.value = result.access_token
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
