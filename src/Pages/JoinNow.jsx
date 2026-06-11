import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'

function JoinNow() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    const result = await register(form.name, form.email, form.password)
    if (result.success) {
      navigate('/')
    } else {
      setError(result.message)
    }
  }

  return (
    <section className="login-form sign-up-form d-flex align-items-center bg-lavendr">
      <div className="container">
        <div className="login-form-title text-center">
          <Link to="/" className="d-inline-block">
            <figure className="login-page-logo">
              <img src="/assets/images/large-logo.png" alt="Pharmez" />
            </figure>
          </Link>
          <h2>Create Your FREE Account</h2>
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
                <label htmlFor="name">Your full name</label>
                <input
                  className="input-field form-control"
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Your e-mail</label>
                <input
                  className="input-field form-control"
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  Enter your password <small>min. 6 characters</small>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="input-field form-control"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    style={{ paddingRight: 40 }}
                  />
                  <i
                    className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#6b7280' }}
                    onClick={() => setShowPassword((v) => !v)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="hover-effect btn btn-primary mb-0"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Register Now'}
              </button>
            </form>
          </div>
          <div className="join-now-outer text-center">
            <Link to="/login">Already have an account? <strong>Sign in</strong></Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default JoinNow
