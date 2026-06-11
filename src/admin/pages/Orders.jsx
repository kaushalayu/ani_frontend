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
        <h1>Orders ({total})</h1>
      </div>

      <div className="admin-table-card">
        <div className="admin-search-bar">
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1) }}
            style={{ padding: '8px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14 }}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s === '' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="admin-loading">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="admin-empty">No orders found.</div>
        ) : (
          <>
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
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>#{order._id.slice(-8).toUpperCase()}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{order.user?.name || order.shippingAddress?.firstName}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{order.user?.email || order.shippingAddress?.email}</div>
                    </td>
                    <td style={{ fontSize: 13 }}>{order.orderItems?.length} item(s)</td>
                    <td style={{ fontWeight: 600 }}>${order.totalPrice?.toFixed(2)}</td>
                    <td style={{ fontSize: 13, textTransform: 'capitalize' }}>{order.paymentMethod}</td>
                    <td>
                      <span className={`status-badge ${STATUS_COLORS[order.orderStatus] || ''}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, color: '#6b7280' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Link to={`/admin/orders/${order._id}`} className="admin-btn admin-btn-outline admin-btn-sm">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="admin-pagination">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i + 1} className={page === i + 1 ? 'active' : ''} onClick={() => setPage(i + 1)}>{i + 1}</button>
                ))}
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminOrders
