import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import API from '../../utils/api'

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
const STATUS_COLORS = {
  pending: 'status-pending', confirmed: 'status-confirmed', processing: 'status-processing',
  shipped: 'status-shipped', delivered: 'status-delivered', cancelled: 'status-cancelled',
}

function AdminOrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    API.get(`/orders/${id}`)
      .then(({ data }) => {
        setOrder(data.order)
        setSelectedStatus(data.order.orderStatus)
      })
      .catch(() => alert('Failed to load order'))
      .finally(() => setLoading(false))
  }, [id])

  const handleStatusUpdate = async () => {
    setUpdating(true)
    try {
      const { data } = await API.put(`/orders/${id}/status`, { orderStatus: selectedStatus })
      setOrder(data.order)
      alert('Order status updated!')
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <div className="admin-loading">Loading order...</div>
  if (!order) return <div className="admin-empty">Order not found.</div>

  const { shippingAddress: addr } = order

  return (
    <div>
      <div className="admin-page-header">
        <h1>Order #{order._id.slice(-8).toUpperCase()}</h1>
        <Link to="/admin/orders" className="admin-btn admin-btn-outline">← Back</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Left */}
        <div>
          {/* Items */}
          <div className="admin-table-card" style={{ marginBottom: 20 }}>
            <div className="admin-table-header"><h2>Order Items</h2></div>
            <table className="admin-table">
              <thead>
                <tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th></tr>
              </thead>
              <tbody>
                {order.orderItems.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={item.image?.startsWith('/uploads') ? `http://localhost:5000${item.image}` : item.image} alt={item.name} className="admin-product-img" />
                        <div>
                          <div style={{ fontWeight: 600 }}>{item.name}</div>
                          {item.pills && <div style={{ fontSize: 12, color: '#6b7280' }}>{item.pills} Pills</div>}
                        </div>
                      </div>
                    </td>
                    <td>${item.price?.toFixed(2)}</td>
                    <td>{item.qty}</td>
                    <td style={{ fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '14px 16px', borderTop: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14 }}>
                <span>Items Total</span><span>${order.itemsPrice?.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14 }}>
                <span>Shipping</span><span>${order.shippingPrice?.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, borderTop: '1px solid #e5e7eb', paddingTop: 8 }}>
                <span>Grand Total</span><span>${order.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="admin-form-card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Shipping Address</h3>
            <p style={{ fontSize: 14, lineHeight: 1.8 }}>
              <strong>{addr?.firstName} {addr?.lastName}</strong><br />
              {addr?.email}<br />
              {addr?.city && `${addr.city}, `}{addr?.state} {addr?.zip}<br />
              {addr?.country}
            </p>
          </div>
        </div>

        {/* Right */}
        <div>
          {/* Status Card */}
          <div className="admin-form-card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Order Status</h3>
            <div style={{ marginBottom: 10 }}>
              <span className={`status-badge ${STATUS_COLORS[order.orderStatus]}`} style={{ fontSize: 13, padding: '5px 14px' }}>
                {order.orderStatus}
              </span>
            </div>
            <div className="admin-form-group" style={{ marginBottom: 12 }}>
              <label>Update Status</label>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <button className="admin-btn admin-btn-primary" onClick={handleStatusUpdate} disabled={updating} style={{ width: '100%', justifyContent: 'center' }}>
              {updating ? 'Updating...' : 'Update Status'}
            </button>
          </div>

          {/* Order Info */}
          <div className="admin-form-card">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Order Info</h3>
            <div style={{ fontSize: 14, lineHeight: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Date</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Payment</span>
                <span style={{ textTransform: 'capitalize' }}>{order.paymentMethod}</span>
              </div>
              {order.subPaymentMethod && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Via</span>
                  <span style={{ textTransform: 'capitalize' }}>{order.subPaymentMethod}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Paid</span>
                <span>{order.isPaid ? '✅ Yes' : '❌ No'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Customer</span>
                <span>{order.user?.name}</span>
              </div>
            </div>
            {order.notes && (
              <div style={{ marginTop: 12, padding: '10px 12px', background: '#fef9c3', borderRadius: 8, fontSize: 13 }}>
                <strong>Note:</strong> {order.notes}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminOrderDetail
