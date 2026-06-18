import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../../utils/api'

const STATUS_COLORS = {
  pending: 'status-pending',
  confirmed: 'status-confirmed',
  processing: 'status-processing',
  shipped: 'status-shipped',
  delivered: 'status-delivered',
  cancelled: 'status-cancelled',
}

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/admin/stats')
        setStats(data.stats)
        setRecentOrders(data.recentOrders)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  if (loading) return (
    <div className="admin-loading">
      <div className="admin-loader" />
      <div>Loading dashboard...</div>
    </div>
  )

  const statCards = [
    { label: 'Total Orders', value: stats?.totalOrders ?? 0, icon: 'fa-solid fa-box', bg: '#ede9fe', color: '#6d28d9' },
    { label: 'Total Revenue', value: `$${(stats?.totalRevenue ?? 0).toFixed(2)}`, icon: 'fa-solid fa-dollar-sign', bg: '#d1fae5', color: '#065f46' },
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: 'fa-solid fa-users', bg: '#dbeafe', color: '#1d4ed8' },
    { label: 'Products', value: stats?.totalProducts ?? 0, icon: 'fa-solid fa-capsules', bg: '#fce7f3', color: '#9d174d' },
    { label: 'Pending Orders', value: stats?.pendingOrders ?? 0, icon: 'fa-solid fa-clock', bg: '#fef3c7', color: '#92400e' },
    { label: 'Delivered', value: stats?.deliveredOrders ?? 0, icon: 'fa-solid fa-circle-check', bg: '#d1fae5', color: '#065f46' },
    { label: 'Contact Messages', value: stats?.contactCount ?? 0, icon: 'fa-solid fa-envelope', bg: '#fce7f3', color: '#9d174d' },
    { label: 'Unread Messages', value: stats?.unreadContactCount ?? 0, icon: 'fa-solid fa-envelope-open', bg: '#fef3c7', color: '#92400e' },
  ]

  return (
    <div>
      <div className="admin-dashboard-hero">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1>
            <i className="fa-solid fa-hand-wave" style={{ marginRight: 10 }} />
            {greeting}, {stats?.name || 'Admin'}!
          </h1>
          <p>Here's what's happening with your store today.</p>
        </div>
      </div>

      <div className="admin-stats-grid">
        {statCards.map((card) => (
          <div className="admin-stat-card" key={card.label}>
            <div className="admin-stat-icon" style={{ background: card.bg, color: card.color }}>
              <i className={card.icon} />
            </div>
            <div className="admin-stat-info">
              <h3>{card.value}</h3>
              <p>{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-table-card">
        <div className="admin-table-header">
          <h2><i className="fa-solid fa-clock-rotate-left" />Recent Orders</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {stats?.unreadContactCount > 0 && (
              <Link to="/admin/messages" className="admin-btn admin-btn-primary admin-btn-sm">
                <i className="fa-solid fa-envelope" /> {stats.unreadContactCount} Unread
              </Link>
            )}
            <Link to="/admin/orders" className="admin-btn admin-btn-outline admin-btn-sm">
              View All <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
        </div>
        {recentOrders.length === 0 ? (
          <div className="admin-empty">
            <i className="fa-solid fa-inbox" style={{ fontSize: 32, display: 'block', marginBottom: 8, color: 'var(--text-light)' }} />
            No orders yet.
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)' }}>
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{order.user?.name || 'N/A'}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{order.user?.email}</div>
                    </td>
                    <td style={{ fontWeight: 700 }}>${order.totalPrice?.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${STATUS_COLORS[order.orderStatus] || ''}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <Link to={`/admin/orders/${order._id}`} className="admin-btn admin-btn-outline admin-btn-xs">
                        View <i className="fa-solid fa-eye" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
