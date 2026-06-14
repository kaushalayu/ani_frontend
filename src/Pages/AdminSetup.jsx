import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../utils/api'

function AdminSetup() {
  const [status, setStatus] = useState(null)   // null = loading, true = admin exists, false = no admin
  const [checking, setChecking] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', password: '', setupKey: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  // Check if admin already exists
  useEffect(() => {
    API.get('/setup/status')
      .then(({ data }) => {
        setStatus(data.adminExists)
      })
      .catch(() => setStatus(null))
      .finally(() => setChecking(false))
  }, [])

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      setError('Please fill all required fields.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { data } = await API.post('/setup/create-admin', form)
      if (data.success) {
        setSuccess(data)
        // Save token & user so they're auto logged in
        localStorage.setItem('pharmez_token', data.token)
        localStorage.setItem('pharmez_user', JSON.stringify(data.user))
        setTimeout(() => window.location.href = '/admin', 2000)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create admin.')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 36, color: '#4f46e5' }} />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', background: '#f3f4f6' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '40px 36px', maxWidth: 480, width: '100%', boxShadow: '0 8px 40px rgba(0,0,0,0.10)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>⚕️</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 6 }}>Pharmez Admin Setup</h1>
          <p style={{ fontSize: 14, color: '#6b7280' }}>One-time setup to create the site administrator</p>
        </div>

        {/* Admin already exists */}
        {status === true && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 12, padding: '20px 24px', marginBottom: 20 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🔒</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#92400e', marginBottom: 6 }}>Setup Already Complete</h3>
              <p style={{ fontSize: 13, color: '#78350f' }}>An admin account already exists. This setup page is permanently disabled for security.</p>
            </div>
            <Link to="/login" style={{ display: 'inline-block', background: '#4f46e5', color: '#fff', padding: '12px 28px', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
              Go to Login
            </Link>
          </div>
        )}

        {/* Success state */}
        {success && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: 12, padding: '20px 24px', marginBottom: 20 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#065f46', marginBottom: 6 }}>Admin Created Successfully!</h3>
              <p style={{ fontSize: 13, color: '#047857' }}>Welcome, {success.user?.name}! Redirecting to Admin Panel...</p>
            </div>
          </div>
        )}

        {/* Setup Form — only shown if no admin exists */}
        {status === false && !success && (
          <>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#1e40af' }}>
              <strong>ℹ️ First-time setup:</strong> This form can only be submitted once. After an admin is created, this page will be locked.
            </div>

            {error && (
              <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626', marginBottom: 16 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Full Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Admin Name"
                  required
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@pharmez.com"
                  required
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Password * <span style={{ color: '#9ca3af', fontSize: 11 }}>(min 6 chars)</span></label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    style={{ width: '100%', padding: '10px 40px 10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, outline: 'none' }}
                  />
                  <i
                    className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                    onClick={() => setShowPassword(v => !v)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#9ca3af' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Setup Key <span style={{ color: '#9ca3af', fontSize: 11 }}>(from .env ADMIN_SETUP_KEY)</span>
                </label>
                <input
                  name="setupKey"
                  value={form.setupKey}
                  onChange={handleChange}
                  placeholder="Enter setup key..."
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, outline: 'none' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '13px', background: loading ? '#9ca3af' : '#4f46e5',
                  color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s'
                }}
              >
                {loading ? 'Creating Admin...' : 'Create Admin Account'}
              </button>
            </form>
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#9ca3af' }}>
          <Link to="/" style={{ color: '#6b7280', textDecoration: 'none' }}>← Back to Site</Link>
        </div>
      </div>
    </div>
  )
}

export default AdminSetup
