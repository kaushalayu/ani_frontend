import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'

function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Support both React Router state and ?redirect= query param
  const searchParams = new URLSearchParams(location.search)
  const redirectParam = searchParams.get('redirect')
  const from = location.state?.from?.pathname || redirectParam || '/'

  const rememberedEmail = localStorage.getItem('pharmez_remember_email') || ''
  const [form, setForm] = useState({ email: rememberedEmail, password: '' })
  const [remember, setRemember] = useState(!!rememberedEmail)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (remember) {
      localStorage.setItem('pharmez_remember_email', form.email)
    } else {
      localStorage.removeItem('pharmez_remember_email')
    }
    const result = await login(form.email, form.password)
    if (result.success) {
      if (result.role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate(from === '/login' ? '/' : from, { replace: true })
      }
    } else {
      setError(result.message)
    }
  }

  return (
    <section className="login-form">
      <div className="container">
        <div className="login-form-title">
          <Link to="/">
            <figure className="login-page-logo">
              <img src="/assets/images/large-logo.png" alt="Pharmez" />
            </figure>
          </Link>
          <h2>Welcome back</h2>
          <p>Sign in to access your account</p>
        </div>
        <div className="login-form-box">
          <div className="login-card">
            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{
                  background: '#fee2e2', color: '#dc2626', padding: '10px 14px',
                  borderRadius: 8, fontSize: 14, marginBottom: 16, border: '1px solid #fca5a5'
                }}>
                  {error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-icon-wrap">
                  <input
                    className="input-field"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                  <i className="fa-regular fa-envelope" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-icon-wrap">
                  <input
                    className="input-field"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <i
                    className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowPassword((v) => !v)}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                <span>{loading ? 'Signing in...' : 'Sign In'} <i className="fa-solid fa-arrow-right" /></span>
              </button>

              <div className="login-extra">
                <label>
                  <input type="checkbox" name="remember" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                  Remember me
                </label>
                <Link to="/contact" className="forgot-password">Forgot password?</Link>
              </div>
            </form>
          </div>
          <div className="join-now-outer">
            <Link to="/join-now">Don't have an account? <strong>Create one</strong></Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
