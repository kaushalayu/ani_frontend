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

  if (loading) return (
    <div className="admin-loading">
      <div className="admin-loader" />
      <div>Loading order...</div>
    </div>
  )
  if (!order) return (
    <div className="admin-empty">
      <i className="fa-solid fa-circle-exclamation" style={{ fontSize: 32, display: 'block', marginBottom: 8, color: 'var(--text-light)' }} />
      Order not found.
    </div>
  )

  const { shippingAddress: addr } = order

  return (
    <div>
      <div className="admin-page-header">
        <h1>
          <i className="fa-solid fa-receipt" style={{ marginRight: 10, color: 'var(--primary)' }} />
          Order #{order._id.slice(-8).toUpperCase()}
        </h1>
        <Link to="/admin/orders" className="admin-btn admin-btn-outline">
          <i className="fa-solid fa-arrow-left" /> Back
        </Link>
      </div>

      <div className="order-detail-grid">
        {/* Left Column */}
        <div>
          <div className="admin-table-card" style={{ marginBottom: 20 }}>
            <div className="admin-table-header">
              <h2><i className="fa-solid fa-bag-shopping" style={{ marginRight: 8, color: 'var(--primary)' }} />Order Items</h2>
            </div>
            <table className="admin-table">
              <thead>
                <tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th></tr>
              </thead>
              <tbody>
                {order.orderItems.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img
                          src={item.image?.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL}${item.image}` : item.image}
                          alt={item.name}
                          className="admin-product-img"
                        />
                        <div>
                          <div style={{ fontWeight: 600 }}>{item.name}</div>
                          {item.pills && <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.pills} Pills</div>}
                        </div>
                      </div>
                    </td>
                    <td>${item.price?.toFixed(2)}</td>
                    <td>{item.qty}</td>
                    <td style={{ fontWeight: 700 }}>${(item.price * item.qty).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
              <div className="order-info-line"><span>Items Total</span><span>${order.itemsPrice?.toFixed(2)}</span></div>
              <div className="order-info-line"><span>Shipping</span><span>${order.shippingPrice?.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16, borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 6 }}>
                <span>Grand Total</span>
                <span style={{ color: 'var(--primary)' }}>${order.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="admin-form-card" style={{ marginBottom: 20 }}>
            <div className="admin-section-title">
              <i className="fa-solid fa-location-dot" /> Shipping Address
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-primary)' }}>
              <strong>{addr?.firstName} {addr?.lastName}</strong><br />
              <i className="fa-regular fa-envelope" style={{ marginRight: 6, color: 'var(--text-light)' }} />{addr?.email}<br />
              {addr?.city && <><i className="fa-solid fa-city" style={{ marginRight: 6, color: 'var(--text-light)' }} />{addr.city}, </>}{addr?.state} {addr?.zip}<br />
              {addr?.country}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Status Card */}
          <div className="admin-form-card" style={{ marginBottom: 20 }}>
            <div className="admin-section-title">
              <i className="fa-solid fa-circle-info" /> Order Status
            </div>
            <div style={{ marginBottom: 14 }}>
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
              <i className={`fa-solid ${updating ? 'fa-spinner fa-spin' : 'fa-pen'}`} />
              {updating ? 'Updating...' : 'Update Status'}
            </button>
          </div>

          {/* Order Info */}
          <div className="admin-form-card">
            <div className="admin-section-title">
              <i className="fa-solid fa-clock" /> Order Info
            </div>
            <div style={{ fontSize: 14 }}>
              <div className="order-info-line">
                <span>Date</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="order-info-line">
                <span>Payment</span>
                <span style={{ textTransform: 'capitalize' }}>{order.paymentMethod}</span>
              </div>
              {order.subPaymentMethod && (
                <div className="order-info-line">
                  <span>Via</span>
                  <span style={{ textTransform: 'capitalize' }}>{order.subPaymentMethod}</span>
                </div>
              )}
              <div className="order-info-line">
                <span>Paid</span>
                <span>{order.isPaid ? '✅ Yes' : '❌ No'}</span>
              </div>
              <div className="order-info-line">
                <span>Customer</span>
                <span>{order.user?.name}</span>
              </div>
            </div>
            {order.notes && (
              <div style={{ marginTop: 12, padding: '12px 14px', background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 8, fontSize: 13 }}>
                <strong><i className="fa-solid fa-note-sticky" style={{ marginRight: 6 }} />Note:</strong> {order.notes}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminOrderDetail
