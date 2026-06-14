import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'
import { useToast } from '../Components/Toast'
import API from '../utils/api'

function Profile() {
  const { user, refreshUser } = useAuth()
  const { addToast } = useToast()

  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
    country: user?.address?.country || 'India',
  })

  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [pwError, setPwError] = useState('')
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false })

  const handleProfileChange = (e) => {
    setProfileForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await API.put('/auth/profile', {
        name: profileForm.name,
        phone: profileForm.phone,
        address: {
          city: profileForm.city,
          state: profileForm.state,
          zip: profileForm.zip,
          country: profileForm.country,
        },
      })
      await refreshUser()
      addToast('Profile updated successfully!', 'cart')
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update profile', 'info')
    } finally {
      setSaving(false)
    }
  }

  const handlePwSubmit = async (e) => {
    e.preventDefault()
    setPwError('')
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New passwords do not match.')
      return
    }
    if (pwForm.newPassword.length < 6) {
      setPwError('New password must be at least 6 characters.')
      return
    }
    setSaving(true)
    try {
      await API.put('/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      })
      addToast('Password changed successfully!', 'cart')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  const tabs = [
    { id: 'profile',  label: 'Edit Profile',     icon: 'fa-solid fa-user-pen' },
    { id: 'password', label: 'Change Password',  icon: 'fa-solid fa-lock' },
    { id: 'orders',   label: 'My Orders',        icon: 'fa-solid fa-bag-shopping' },
  ]

  return (
    <div style={{ padding: '40px 0 80px', background: '#f8fafc', minHeight: '70vh' }}>
      <div className="container">

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
            My Account
          </h1>
          <div style={{ fontSize: 13, color: '#6b7280', display: 'flex', gap: 6 }}>
            <Link to="/" style={{ color: '#0f766e', textDecoration: 'none' }}>Home</Link>
            <span>›</span>
            <span>My Account</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24, alignItems: 'start' }}>

          {/* Sidebar */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            {/* Avatar */}
            <div style={{ padding: '28px 20px', textAlign: 'center', background: 'linear-gradient(135deg, #0f766e, #14b8a6)', color: '#fff' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'rgba(255,255,255,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, fontWeight: 800, margin: '0 auto 12px',
                border: '2px solid rgba(255,255,255,0.5)',
              }}>
                {initials}
              </div>
              <p style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>{user?.name}</p>
              <p style={{ fontSize: 12, opacity: 0.85, margin: '4px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
            </div>

            {/* Nav tabs */}
            <div style={{ padding: '8px 0' }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => tab.id === 'orders' ? window.location.href = '/my-orders' : setActiveTab(tab.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    width: '100%', padding: '11px 20px',
                    background: activeTab === tab.id ? '#f0fdf4' : 'none',
                    border: 'none',
                    borderLeft: activeTab === tab.id ? '3px solid #0f766e' : '3px solid transparent',
                    color: activeTab === tab.id ? '#0f766e' : '#374151',
                    fontWeight: activeTab === tab.id ? 700 : 500,
                    fontSize: 13.5,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}
                >
                  <i className={tab.icon} style={{ width: 16, fontSize: 14 }} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', padding: '28px 30px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>

            {/* ── PROFILE TAB ── */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit}>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: '#111827', marginBottom: 22, paddingBottom: 14, borderBottom: '1px solid #f1f5f9' }}>
                  <i className="fa-solid fa-user-pen" style={{ marginRight: 8, color: '#0f766e' }} />
                  Edit Profile
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                      Full Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      required
                      placeholder="Your full name"
                      style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 9, fontSize: 13.5, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
                      onFocus={e => e.target.style.borderColor = '#0f766e'}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Phone</label>
                    <input
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                      placeholder="+91 XXXXX XXXXX"
                      style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 9, fontSize: 13.5, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
                      onFocus={e => e.target.style.borderColor = '#0f766e'}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Email</label>
                  <input
                    value={user?.email || ''}
                    disabled
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 9, fontSize: 13.5, background: '#f9fafb', color: '#9ca3af', marginBottom: 16, fontFamily: 'inherit' }}
                  />
                  <p style={{ fontSize: 11, color: '#9ca3af', marginTop: -10, marginBottom: 16 }}>Email cannot be changed</p>
                </div>

                <h4 style={{ fontSize: 13.5, fontWeight: 700, color: '#374151', marginBottom: 14 }}>
                  <i className="fa-solid fa-location-dot" style={{ marginRight: 6, color: '#0f766e' }} />Delivery Address
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#374151', marginBottom: 6 }}>City</label>
                    <input name="city" value={profileForm.city} onChange={handleProfileChange} placeholder="Mumbai"
                      style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 9, fontSize: 13.5, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
                      onFocus={e => e.target.style.borderColor = '#0f766e'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#374151', marginBottom: 6 }}>State</label>
                    <input name="state" value={profileForm.state} onChange={handleProfileChange} placeholder="Maharashtra"
                      style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 9, fontSize: 13.5, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
                      onFocus={e => e.target.style.borderColor = '#0f766e'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#374151', marginBottom: 6 }}>ZIP / Postal Code</label>
                    <input name="zip" value={profileForm.zip} onChange={handleProfileChange} placeholder="400001"
                      style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 9, fontSize: 13.5, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
                      onFocus={e => e.target.style.borderColor = '#0f766e'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Country</label>
                    <input name="country" value={profileForm.country} onChange={handleProfileChange} placeholder="India"
                      style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 9, fontSize: 13.5, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
                      onFocus={e => e.target.style.borderColor = '#0f766e'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  style={{ padding: '11px 28px', background: saving ? '#9ca3af' : '#0f766e', color: '#fff', border: 'none', borderRadius: 9, fontWeight: 700, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <i className={`fa-solid ${saving ? 'fa-spinner fa-spin' : 'fa-floppy-disk'}`} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            )}

            {/* ── PASSWORD TAB ── */}
            {activeTab === 'password' && (
              <form onSubmit={handlePwSubmit}>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: '#111827', marginBottom: 22, paddingBottom: 14, borderBottom: '1px solid #f1f5f9' }}>
                  <i className="fa-solid fa-lock" style={{ marginRight: 8, color: '#0f766e' }} />
                  Change Password
                </h2>

                {pwError && (
                  <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 9, padding: '11px 16px', marginBottom: 18, fontSize: 13, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className="fa-solid fa-circle-exclamation" />
                    {pwError}
                  </div>
                )}

                {[
                  { name: 'currentPassword', label: 'Current Password', key: 'current' },
                  { name: 'newPassword',     label: 'New Password',     key: 'new' },
                  { name: 'confirmPassword', label: 'Confirm New Password', key: 'confirm' },
                ].map(field => (
                  <div key={field.name} style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                      {field.label}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPw[field.key] ? 'text' : 'password'}
                        name={field.name}
                        value={pwForm[field.name]}
                        onChange={e => { setPwError(''); setPwForm(p => ({ ...p, [e.target.name]: e.target.value })) }}
                        placeholder="••••••••"
                        required
                        style={{ width: '100%', padding: '10px 40px 10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 9, fontSize: 13.5, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
                        onFocus={e => e.target.style.borderColor = '#0f766e'}
                        onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                      />
                      <i
                        className={`fa-regular ${showPw[field.key] ? 'fa-eye-slash' : 'fa-eye'}`}
                        onClick={() => setShowPw(p => ({ ...p, [field.key]: !p[field.key] }))}
                        style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#9ca3af', fontSize: 15 }}
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={saving}
                  style={{ marginTop: 8, padding: '11px 28px', background: saving ? '#9ca3af' : '#0f766e', color: '#fff', border: 'none', borderRadius: 9, fontWeight: 700, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <i className={`fa-solid ${saving ? 'fa-spinner fa-spin' : 'fa-shield-halved'}`} />
                  {saving ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
