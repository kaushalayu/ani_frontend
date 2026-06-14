import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import API from '../utils/api'

const AuthContext = createContext()

// ── Helper: safely parse localStorage ──────────────────
const getStoredUser = () => {
  try {
    const saved = localStorage.getItem('pharmez_user')
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

const getStoredToken = () => {
  try {
    return localStorage.getItem('pharmez_token') || null
  } catch {
    return null
  }
}

// ── Helper: check if JWT is expired (client-side) ──────
const isTokenExpired = (token) => {
  if (!token) return true
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    // exp is in seconds, Date.now() is ms
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  // Track if we've done the initial token validation
  const [authChecked, setAuthChecked] = useState(false)

  const isLoggedIn = !!user
  const isAdmin = user?.role === 'admin'

  // ── Clear all auth state ────────────────────────────
  const clearAuth = useCallback(() => {
    localStorage.removeItem('pharmez_token')
    localStorage.removeItem('pharmez_user')
    setUser(null)
  }, [])

  // ── Validate token on app load ──────────────────────
  useEffect(() => {
    const token = getStoredToken()

    // No token at all — clear any stale user data
    if (!token) {
      clearAuth()
      setAuthChecked(true)
      return
    }

    // Token expired client-side — clear immediately without API call
    if (isTokenExpired(token)) {
      clearAuth()
      setAuthChecked(true)
      return
    }

    // Token looks valid — verify with server
    API.get('/auth/me')
      .then(({ data }) => {
        if (data.success && data.user) {
          localStorage.setItem('pharmez_user', JSON.stringify(data.user))
          setUser(data.user)
        } else {
          clearAuth()
        }
      })
      .catch(() => {
        // 401 = token invalid/expired on server
        clearAuth()
      })
      .finally(() => {
        setAuthChecked(true)
      })
  }, [clearAuth])

  // ── Register ────────────────────────────────────────
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

  // ── Login ───────────────────────────────────────────
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

  // ── Logout ──────────────────────────────────────────
  const logout = useCallback(() => {
    clearAuth()
  }, [clearAuth])

  // ── Refresh user from server ────────────────────────
  const refreshUser = async () => {
    try {
      const { data } = await API.get('/auth/me')
      if (data.success && data.user) {
        localStorage.setItem('pharmez_user', JSON.stringify(data.user))
        setUser(data.user)
      } else {
        clearAuth()
      }
    } catch {
      clearAuth()
    }
  }

  // Don't render children until we've validated the token
  // This prevents brief flash of admin panel before redirect
  if (!authChecked) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: '#f0f2f7',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40,
            border: '3px solid #e2e8f0',
            borderTopColor: '#6366f1',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
            margin: '0 auto 12px',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#94a3b8', fontSize: 14, fontFamily: 'Inter, sans-serif' }}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn,
      isAdmin,
      loading,
      error,
      register,
      login,
      logout,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
