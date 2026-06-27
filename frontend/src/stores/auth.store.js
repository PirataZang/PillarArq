import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'
import { getUser, setUser, clearUser, isExpired } from '../utils/authCookie'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(getUser())

  const isAuthenticated = computed(() => !!user.value && !isExpired(user.value.expires_at))

  function hydrateFromCookie() {
    user.value = getUser()
  }

  function isUserExpired() {
    return !user.value || isExpired(user.value.expires_at)
  }

  function clearSession() {
    user.value = null
    clearUser()
  }

  function persistUser(userData, expiresInSeconds) {
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString()
    user.value = { ...userData, expires_at: expiresAt }
    setUser(user.value)
  }

  async function login(credentials) {
    const response = await api.post('/auth/login', credentials, { loading: false })
    const { user: userData, expires_in: expiresIn } = response.data.data
    persistUser(userData, expiresIn)
  }

  async function logout() {
    try {
      await api.post('/auth/logout', {}, { loading: false, skipAuthRedirect: true })
    } catch {
      // Sessão já pode estar inválida
    }
    clearSession()
  }

  async function validateSession() {
    if (isUserExpired()) {
      clearSession()
      return false
    }

    try {
      const response = await api.get('/auth/me', { loading: false, skipAuthRedirect: true })
      const userData = response.data.data
      const expiresAt =
        user.value?.expires_at ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      user.value = { ...userData, expires_at: expiresAt }
      setUser(user.value)
      return true
    } catch {
      clearSession()
      return false
    }
  }

  const hasPermission = (permission) => {
    if (!user.value) return false
    if (user.value.is_master) return true

    const [module, action] = permission.split('.')
    return user.value.permissions?.[module]?.actions?.[action]?.value === true
  }

  return {
    user,
    isAuthenticated,
    hydrateFromCookie,
    isUserExpired,
    clearSession,
    login,
    logout,
    validateSession,
    hasPermission,
  }
})
