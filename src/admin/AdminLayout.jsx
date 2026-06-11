import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'
import './admin.css'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: 'fa-solid fa-chart-pie', end: true },
  { to: '/admin/products', label: 'Products', icon: 'fa-solid fa-capsules' },
  { to: '/admin/orders', label: 'Orders', icon: 'fa-solid fa-truck' },
  { to: '/admin/users', label: 'Users', icon: 'fa-solid fa-users' },
  { to: '/admin/categories', label: 'Categories', icon: 'fa-solid fa-tags' },
  { to: '/admin/blogs', label: 'Blog Posts', icon: 'fa-solid fa-newspaper' },
  { to: '/admin/seo', label: 'SEO Settings', icon: 'fa-solid fa-magnifying-glass-chart' },
]

function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'A'

  return (
    <div className={`admin-wrapper ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      {/* Mobile overlay */}
      <div
        className={`admin-mobile-overlay ${mobileOpen ? 'show' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="admin-logo">
          <div className="admin-logo-icon">
            <i className="fa-solid fa-heart-pulse" />
          </div>
          {sidebarOpen && <span className="admin-logo-text">Pharmez</span>}
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? 'active' : ''}`
              }
              onClick={() => setMobileOpen(false)}
            >
              <span className="admin-nav-icon">
                <i className={item.icon} />
              </span>
              {sidebarOpen && <span className="admin-nav-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <button className="admin-logout-btn" onClick={handleLogout}>
          <span className="admin-nav-icon">
            <i className="fa-solid fa-right-from-bracket" />
          </span>
          {sidebarOpen && <span>Logout</span>}
        </button>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className="admin-mobile-toggle"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Open menu"
            >
              <i className="fa-solid fa-bars" />
            </button>
            <button
              className="admin-toggle-btn"
              onClick={() => setSidebarOpen(v => !v)}
              aria-label="Toggle sidebar"
            >
              <i className={`fa-solid ${sidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`} />
            </button>
          </div>
          <div className="admin-topbar-right">
            <span className="admin-user-info">
              <span className="admin-user-avatar">{initials}</span>
              <strong>{user?.name}</strong>
              <span className="admin-role-badge">Admin</span>
            </span>
            <NavLink to="/" className="admin-visit-site" target="_blank">
              <i className="fa-solid fa-external-link-alt" />
              <span>Visit Site</span>
            </NavLink>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
