import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
})

// Auto-attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('pharmez_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto-logout on 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pharmez_token')
      localStorage.removeItem('pharmez_user')
    }
    return Promise.reject(error)
  }
)

export default API
