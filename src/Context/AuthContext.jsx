import { createContext, useContext, useState, useEffect } from 'react'
import API from '../utils/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('pharmez_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isLoggedIn = !!user
  const isAdmin = user?.role === 'admin'

  // Register
  const register = async (name, email, password) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await API.post('/auth/register', { name, email, password })
      localStorage.setItem('pharmez_token', data.token)
      localStorage.setItem('pharmez_user', JSON.stringify(data.user))
      setUser(data.user)
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      setError(msg)
      return { success: false, message: msg }
    } finally {
      setLoading(false)
    }
  }

  // Login
  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await API.post('/auth/login', { email, password })
      localStorage.setItem('pharmez_token', data.token)
      localStorage.setItem('pharmez_user', JSON.stringify(data.user))
      setUser(data.user)
      return { success: true, role: data.user.role }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      setError(msg)
      return { success: false, message: msg }
    } finally {
      setLoading(false)
    }
  }

  // Logout
  const logout = () => {
    localStorage.removeItem('pharmez_token')
    localStorage.removeItem('pharmez_user')
    setUser(null)
  }

  // Refresh user data from server
  const refreshUser = async () => {
    try {
      const { data } = await API.get('/auth/me')
      localStorage.setItem('pharmez_user', JSON.stringify(data.user))
      setUser(data.user)
    } catch {
      logout()
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isAdmin, loading, error, register, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
