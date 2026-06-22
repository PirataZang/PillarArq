import axios from 'axios'
import { useLoadingStore } from '../stores/loading.store'
import { useAuthStore } from '../stores/auth.store'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000 
})

// Variável para evitar múltiplos refreshs simultâneos
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Tratamento de Loading (default true, mas pode ser desativado via { loading: false })
    if (config.loading !== false) {
      const loadingStore = useLoadingStore()
      loadingStore.show()
    }

    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }

    return config
  },
  (error) => {
    if (error.config?.loading !== false) {
      useLoadingStore().hide()
    }
    return Promise.reject(error)
  }
)

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    if (response.config?.loading !== false) {
      useLoadingStore().hide()
    }
    return response
  },
  async (error) => {
    if (error.config?.loading !== false) {
      useLoadingStore().hide()
    }

    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      const authStore = useAuthStore()
      
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token
          return api(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const hasRefreshed = await authStore.refreshToken()
        
        if (hasRefreshed) {
          processQueue(null, authStore.token)
          originalRequest.headers['Authorization'] = `Bearer ${authStore.token}`
          return api(originalRequest)
        } else {
          // Fallback se o refresh falhar
          processQueue(new Error('Refresh failed'))
          authStore.logout()
          window.location.href = '/login'
        }
      } catch (err) {
        processQueue(err)
        authStore.logout()
        window.location.href = '/login'
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
