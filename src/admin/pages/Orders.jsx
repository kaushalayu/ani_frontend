import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../../utils/api'

const STATUS_OPTIONS = ['', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
const STATUS_COLORS = {
  pending: 'status-pending', confirmed: 'status-confirmed', processing: 'status-processing',
  shipped: 'status-shipped', delivered: 'status-delivered', cancelled: 'status-cancelled',
}

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const LIMIT = 15

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: LIMIT })
      if (filterStatus) params.append('status', filterStatus)
      const { data } = await API.get(`/orders?${params}`)
      setOrders(data.orders)
      setTotal(data.total)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [page, filterStatus])

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div>
      <div className="admin-page-header">
        <h1><i className="fa-solid fa-truck" style={{ marginRight: 10, color: 'var(--primary)' }} />Orders ({total})</h1>
      </div>

      <div className="admin-table-card">
        <div className="admin-search-bar">
          <i className="fa-solid fa-filter" style={{ color: 'var(--text-light)' }} />
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1) }}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s === '' ? '📋 All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          {filterStatus && (
            <button
              onClick={() => { setFilterStatus(''); setPage(1) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', fontSize: 13 }}
            >
              <i className="fa-solid fa-xmark" /> Clear
            </button>
          )}
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="admin-loader" />
            <div>Loading orders...</div>
          </div>
        ) : orders.length === 0 ? (
          <div className="admin-empty">
            <i className="fa-solid fa-inbox" style={{ fontSize: 32, display: 'block', marginBottom: 8, color: 'var(--text-light)' }} />
            No orders found.
          </div>
        ) : (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)' }}>
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{order.user?.name || order.shippingAddress?.firstName || 'N/A'}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{order.user?.email || order.shippingAddress?.email}</div>
                      </td>
                      <td style={{ fontSize: 13 }}>{order.orderItems?.length} item(s)</td>
                      <td style={{ fontWeight: 700 }}>${order.totalPrice?.toFixed(2)}</td>
                      <td style={{ fontSize: 13, textTransform: 'capitalize' }}>
                        <i className="fa-solid fa-credit-card" style={{ marginRight: 5, color: 'var(--text-light)' }} />
                        {order.paymentMethod}
                      </td>
                      <td>
                        <span className={`status-badge ${STATUS_COLORS[order.orderStatus] || ''}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        <i className="fa-regular fa-calendar" style={{ marginRight: 5 }} />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <Link to={`/admin/orders/${order._id}`} className="admin-btn admin-btn-outline admin-btn-xs">
                          <i className="fa-solid fa-eye" /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="admin-pagination">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                  <i className="fa-solid fa-chevron-left" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i + 1} className={page === i + 1 ? 'active' : ''} onClick={() => setPage(i + 1)}>{i + 1}</button>
                ))}
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                  <i className="fa-solid fa-chevron-right" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminOrders
