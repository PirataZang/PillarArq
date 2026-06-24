import axios from 'axios'
import { useLoadingStore } from '../stores/loading.store'
import { useAuthStore } from '../stores/auth.store'

const PUBLIC_PATHS = ['/auth/login', '/auth/refresh', '/companies']

function isPublicRequest(url) {
  return PUBLIC_PATHS.some((path) => url?.includes(path))
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
})

api.interceptors.request.use(
  (config) => {
    if (config.loading !== false) {
      useLoadingStore().show()
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

    const { config, response } = error

    if (
      response?.status === 401 &&
      config &&
      !config.skipAuthRedirect &&
      !isPublicRequest(config.url)
    ) {
      const authStore = useAuthStore()
      authStore.clearSession()

      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api
