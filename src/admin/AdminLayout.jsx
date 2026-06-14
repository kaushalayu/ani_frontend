import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'
import API from '../utils/api'
import './admin.css'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: 'fa-solid fa-chart-pie', end: true },
  { to: '/admin/products', label: 'Products', icon: 'fa-solid fa-capsules' },
  { to: '/admin/orders', label: 'Orders', icon: 'fa-solid fa-truck' },
  { to: '/admin/users', label: 'Users', icon: 'fa-solid fa-users' },
  { to: '/admin/categories', label: 'Categories', icon: 'fa-solid fa-tags' },
  { to: '/admin/blogs', label: 'Blog Posts', icon: 'fa-solid fa-newspaper' },
  { to: '/admin/testimonials', label: 'Testimonials', icon: 'fa-solid fa-star' },
  { to: '/admin/faqs', label: 'FAQs', icon: 'fa-solid fa-question-circle' },
  { to: '/admin/team', label: 'Team', icon: 'fa-solid fa-users' },
  { to: '/admin/services', label: 'Services', icon: 'fa-solid fa-hand-holding-heart' },
  { to: '/admin/messages', label: 'Messages', icon: 'fa-solid fa-envelope' },
  { to: '/admin/seo', label: 'SEO Settings', icon: 'fa-solid fa-magnifying-glass-chart' },
]

function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!location.pathname.startsWith('/admin/messages')) return
    API.get('/contact', { params: { limit: 1, status: 'unread' } })
      .then(({ data }) => setUnreadCount(data.unreadCount || 0))
      .catch(() => {})
  }, [location.pathname])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'A'

  return (
    <div className={`admin-wrapper ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      <div
        className={`admin-mobile-overlay ${mobileOpen ? 'show' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      <aside className={`admin-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo-icon">
            <i className="fa-solid fa-heart-pulse" />
          </div>
          {sidebarOpen && (
            <>
              <div className="admin-logo-text">
                Phar<span>mez</span>
              </div>
              <span className="admin-sidebar-badge">Admin</span>
            </>
          )}
        </div>

        <nav className="admin-nav">
          {sidebarOpen && <div className="admin-nav-section-label">Main Menu</div>}
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={!sidebarOpen ? item.label : undefined}
              className={({ isActive: active }) =>
                `admin-nav-item ${active ? 'active' : ''}`
              }
            >
              <span className="admin-nav-icon">
                <i className={item.icon} />
              </span>
              {sidebarOpen && (
                <>
                  <span className="admin-nav-label">{item.label}</span>
                  {item.to === '/admin/messages' && unreadCount > 0 && (
                    <span className="admin-nav-count">{unreadCount > 99 ? '99+' : unreadCount}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <span className="admin-nav-icon">
              <i className="fa-solid fa-right-from-bracket" />
            </span>
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-mobile-toggle"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
            >
              <i className="fa-solid fa-bars" />
            </button>
            <button
              className="admin-toggle-btn"
              onClick={() => setSidebarOpen(v => !v)}
              aria-label="Toggle sidebar"
              title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <i className={`fa-solid ${sidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`} />
            </button>
          </div>

          <div className="admin-topbar-right">
            <NavLink to="/" className="admin-visit-site" target="_blank">
              <i className="fa-solid fa-arrow-up-right-from-square" />
              <span>Visit Site</span>
            </NavLink>
            <div className="admin-user-info">
              <span className="admin-user-avatar">{initials}</span>
              <span className="admin-user-name">{user?.name}</span>
              <span className="admin-role-badge">Admin</span>
            </div>
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
