import axios from 'axios'

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  timeout: 15000, // 15s timeout — prevent hanging requests
})

// ── Attach Bearer token to every request ──────────────
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pharmez_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Handle 401 globally — clear auth + redirect to login ──
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stored credentials
      localStorage.removeItem('pharmez_token')
      localStorage.removeItem('pharmez_user')

      // If we're inside the admin panel, redirect to login
      const isAdminRoute = window.location.pathname.startsWith('/admin')
      const isAuthRoute  = window.location.pathname === '/login' ||
                           window.location.pathname === '/join-now'

      if (!isAuthRoute) {
        // Use location.href so React re-mounts fresh with cleared state
        const redirectTo = isAdminRoute
          ? '/login'
          : `/login?redirect=${encodeURIComponent(window.location.pathname)}`
        window.location.href = redirectTo
      }
    }
    return Promise.reject(error)
  }
)

export default API
