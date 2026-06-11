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

  if (loading) return <div className="admin-loading">Loading dashboard...</div>

  const statCards = [
    { label: 'Total Orders', value: stats?.totalOrders ?? 0, icon: '📦', bg: '#dbeafe', color: '#1d4ed8' },
    { label: 'Total Revenue', value: `$${(stats?.totalRevenue ?? 0).toFixed(2)}`, icon: '💰', bg: '#d1fae5', color: '#065f46' },
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: '👥', bg: '#ede9fe', color: '#6d28d9' },
    { label: 'Products', value: stats?.totalProducts ?? 0, icon: '💊', bg: '#fce7f3', color: '#9d174d' },
    { label: 'Pending Orders', value: stats?.pendingOrders ?? 0, icon: '⏳', bg: '#fef3c7', color: '#92400e' },
    { label: 'Delivered', value: stats?.deliveredOrders ?? 0, icon: '✅', bg: '#d1fae5', color: '#065f46' },
  ]

  return (
    <div>
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <span style={{ fontSize: 13, color: '#6b7280' }}>Welcome back, Admin!</span>
      </div>

      {/* Stats */}
      <div className="admin-stats-grid">
        {statCards.map((card) => (
          <div className="admin-stat-card" key={card.label}>
            <div className="admin-stat-icon" style={{ background: card.bg, color: card.color }}>
              {card.icon}
            </div>
            <div className="admin-stat-info">
              <h3>{card.value}</h3>
              <p>{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="admin-table-card">
        <div className="admin-table-header">
          <h2>Recent Orders</h2>
          <Link to="/admin/orders" className="admin-btn admin-btn-outline admin-btn-sm">View All</Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="admin-empty">No orders yet.</div>
        ) : (
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
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>#{order._id.slice(-8).toUpperCase()}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{order.user?.name || 'N/A'}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{order.user?.email}</div>
                  </td>
                  <td style={{ fontWeight: 600 }}>${order.totalPrice?.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${STATUS_COLORS[order.orderStatus] || ''}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: '#6b7280' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <Link to={`/admin/orders/${order._id}`} className="admin-btn admin-btn-outline admin-btn-sm">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Dashboard
