import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import API from '../../utils/api'
import OrderTracker from '../../Components/OrderTracker'

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

const STATUS_META = {
  pending:    { cls: 'status-pending',    icon: 'fa-clock',        label: 'Pending' },
  confirmed:  { cls: 'status-confirmed',  icon: 'fa-circle-check', label: 'Confirmed' },
  processing: { cls: 'status-processing', icon: 'fa-gear',         label: 'Processing' },
  shipped:    { cls: 'status-shipped',    icon: 'fa-truck',        label: 'Shipped' },
  delivered:  { cls: 'status-delivered',  icon: 'fa-box-open',     label: 'Delivered' },
  cancelled:  { cls: 'status-cancelled',  icon: 'fa-xmark-circle', label: 'Cancelled' },
}

function AdminOrderDetail() {
  const { id } = useParams()
  const [order, setOrder]               = useState(null)
  const [loading, setLoading]           = useState(true)
  const [updating, setUpdating]         = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [toast, setToast]               = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const fetchOrder = () => {
    setLoading(true)
    API.get(`/orders/${id}`)
      .then(({ data }) => {
        setOrder(data.order)
        setSelectedStatus(data.order.orderStatus)
      })
      .catch(() => showToast('Failed to load order', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrder() }, [id])

  const handleStatusUpdate = async () => {
    if (selectedStatus === order.orderStatus) {
      showToast('Status is already ' + selectedStatus, 'info')
      return
    }
    setUpdating(true)
    try {
      const { data } = await API.put(`/orders/${id}/status`, { orderStatus: selectedStatus })
      setOrder(data.order)
      showToast(`Status updated to "${selectedStatus}" ✓`)
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error')
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
      <i className="fa-solid fa-circle-exclamation" style={{ fontSize: 32, display: 'block', marginBottom: 8 }} />
      Order not found.
      <Link to="/admin/orders" className="admin-btn admin-btn-outline" style={{ marginTop: 16 }}>
        <i className="fa-solid fa-arrow-left" /> Back to Orders
      </Link>
    </div>
  )

  const { shippingAddress: addr } = order
  const meta = STATUS_META[order.orderStatus] || STATUS_META.pending

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className={`admin-toast admin-toast-${toast.type}`} style={{ marginBottom: 16 }}>
          <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : toast.type === 'error' ? 'fa-circle-xmark' : 'fa-circle-info'}`} />
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="admin-page-header">
        <h1>
          <i className="fa-solid fa-receipt" />
          Order #{order._id.slice(-8).toUpperCase()}
        </h1>
        <div className="order-page-header-actions" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <span className={`status-badge ${meta.cls}`} style={{ fontSize: 13, padding: '6px 16px' }}>
            <i className={`fa-solid ${meta.icon}`} style={{ marginRight: 6 }} />
            {meta.label}
          </span>
          <Link to="/admin/orders" className="admin-btn admin-btn-outline">
            <i className="fa-solid fa-arrow-left" /> Back
          </Link>
        </div>
      </div>

      {/* ── Order Tracker — full width ── */}
      <div className="admin-form-card" style={{ marginBottom: 22 }}>
        <div className="admin-section-title">
          <i className="fa-solid fa-route" /> Order Journey
        </div>
        <OrderTracker
          status={order.orderStatus}
          createdAt={order.createdAt}
          deliveredAt={order.deliveredAt}
          compact={false}
        />
      </div>

      {/* ── Main grid ── */}
      <div className="order-detail-grid">

        {/* ── Left: Items + Address ── */}
        <div>
          {/* Items table */}
          <div className="admin-table-card" style={{ marginBottom: 20 }}>
            <div className="admin-table-header">
              <h2>
                <i className="fa-solid fa-bag-shopping" />
                Order Items ({order.orderItems.length})
              </h2>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img
                            src={
                              item.image?.startsWith('/uploads')
                                ? `${import.meta.env.VITE_API_URL}${item.image}`
                                : item.image || '/assets/images/best-product1.png'
                            }
                            alt={item.name}
                            className="admin-product-img"
                          />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{item.name}</div>
                            {item.pills && (
                              <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                                <i className="fa-solid fa-pills" style={{ marginRight: 4 }} />
                                {item.pills} Pills
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: 13 }}>${item.price?.toFixed(2)}</td>
                      <td style={{ fontSize: 13, fontWeight: 600 }}>{item.qty}</td>
                      <td style={{ fontWeight: 700 }}>${(item.price * item.qty).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Price summary */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-soft)' }}>
              <div className="order-info-line">
                <span>Items Total</span>
                <span>${order.itemsPrice?.toFixed(2)}</span>
              </div>
              <div className="order-info-line">
                <span>Shipping</span>
                <span>${order.shippingPrice?.toFixed(2)}</span>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontWeight: 800, fontSize: 16,
                borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 8,
              }}>
                <span>Grand Total</span>
                <span style={{ color: 'var(--primary)' }}>${order.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="admin-form-card">
            <div className="admin-section-title">
              <i className="fa-solid fa-location-dot" /> Shipping Address
            </div>
            <div style={{ fontSize: 13.5, lineHeight: 1.9, color: 'var(--text-primary)' }}>
              <strong style={{ fontSize: 14 }}>{addr?.firstName} {addr?.lastName}</strong>
              <br />
              <span style={{ color: 'var(--text-secondary)' }}>
                <i className="fa-regular fa-envelope" style={{ marginRight: 6 }} />{addr?.email}
              </span>
              {(addr?.city || addr?.state || addr?.zip) && (
                <>
                  <br />
                  <span style={{ color: 'var(--text-secondary)' }}>
                    <i className="fa-solid fa-map-pin" style={{ marginRight: 6 }} />
                    {[addr.city, addr.state, addr.zip].filter(Boolean).join(', ')}
                  </span>
                </>
              )}
              {addr?.country && (
                <>
                  <br />
                  <span style={{ color: 'var(--text-secondary)' }}>
                    <i className="fa-solid fa-globe" style={{ marginRight: 6 }} />{addr.country}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Right: Status update + Info ── */}
        <div>
          {/* Status update card */}
          <div className="admin-form-card" style={{ marginBottom: 20 }}>
            <div className="admin-section-title">
              <i className="fa-solid fa-pen-to-square" /> Update Order Status
            </div>

            {/* Status buttons */}
            <div className="status-buttons-wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
              {STATUS_OPTIONS.map(s => {
                const m = STATUS_META[s]
                const isSelected = selectedStatus === s
                const isCurrent  = order.orderStatus === s
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedStatus(s)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '7px 14px', borderRadius: 20,
                      border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                      background: isSelected ? 'var(--primary)' : 'var(--card-bg)',
                      color: isSelected ? '#fff' : 'var(--text-secondary)',
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: 12.5,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s',
                      position: 'relative',
                    }}
                  >
                    <i className={`fa-solid ${m.icon}`} />
                    {m.label}
                    {isCurrent && (
                      <span style={{
                        position: 'absolute', top: -6, right: -6,
                        width: 14, height: 14, borderRadius: '50%',
                        background: '#10b981', border: '2px solid #fff',
                        fontSize: 0,
                      }} />
                    )}
                  </button>
                )
              })}
            </div>

            <div style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 14 }}>
              <i className="fa-solid fa-circle" style={{ color: '#10b981', fontSize: 8, marginRight: 5 }} />
              Green dot = current status
            </div>

            <button
              className="admin-btn admin-btn-primary"
              onClick={handleStatusUpdate}
              disabled={updating || selectedStatus === order.orderStatus}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <i className={`fa-solid ${updating ? 'fa-spinner fa-spin' : 'fa-floppy-disk'}`} />
              {updating ? 'Updating...' : 'Save Status'}
            </button>
          </div>

          {/* Order info */}
          <div className="admin-form-card">
            <div className="admin-section-title">
              <i className="fa-solid fa-circle-info" /> Order Details
            </div>
            <div style={{ fontSize: 13.5 }}>
              <div className="order-info-line">
                <span>Order Date</span>
                <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="order-info-line">
                <span>Customer</span>
                <span style={{ fontWeight: 600 }}>{order.user?.name || addr?.firstName + ' ' + addr?.lastName}</span>
              </div>
              <div className="order-info-line">
                <span>Email</span>
                <span style={{ color: 'var(--primary)' }}>{order.user?.email || addr?.email}</span>
              </div>
              <div className="order-info-line">
                <span>Payment Via</span>
                <span style={{ textTransform: 'capitalize' }}>
                  {order.paymentMethod}
                  {order.subPaymentMethod && ` · ${order.subPaymentMethod}`}
                </span>
              </div>
              {order.paymentMethod === 'card' && order.cardDetails && (
                <div className="card-details-box">
                  <strong><i className="fa-regular fa-credit-card" style={{ marginRight: 6 }} />Card Details</strong>
                  <div style={{ fontSize: 13, marginTop: 8, lineHeight: 1.8 }}>
                    <div><span style={{ color: 'var(--text-secondary)' }}>Name:</span> {order.cardDetails.nameOnCard}</div>
                    <div><span style={{ color: 'var(--text-secondary)' }}>Card:</span> **** **** **** {order.cardDetails.lastFourDigits}</div>
                    <div><span style={{ color: 'var(--text-secondary)' }}>Expiry:</span> {order.cardDetails.expiryDate}</div>
                  </div>
                  <div style={{ marginTop: 10, padding: '8px 12px', background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 8, fontSize: 12, color: '#92400e' }}>
                    <i className="fa-solid fa-clock" style={{ marginRight: 5 }} />
                    This order is pending approval. Change status to <strong>Confirmed</strong> to approve it.
                  </div>
                </div>
              )}
              {order.paymentMethod === 'bitcoin' && (
                <div className="card-details-box" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                  <strong><i className="fa-brands fa-bitcoin" style={{ marginRight: 6, color: '#f59e0b' }} />Bitcoin Payment</strong>
                  <div style={{ marginTop: 8, padding: '8px 12px', background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 8, fontSize: 12, color: '#92400e' }}>
                    <i className="fa-solid fa-clock" style={{ marginRight: 5 }} />
                    Awaiting payment confirmation. Check blockchain and change status to <strong>Confirmed</strong> once received.
                  </div>
                </div>
              )}
              <div className="order-info-line">
                <span>Payment Status</span>
                <span>
                  {order.isPaid
                    ? <span style={{ color: '#10b981', fontWeight: 700 }}><i className="fa-solid fa-circle-check" style={{ marginRight: 5 }} />Paid</span>
                    : <span style={{ color: '#f59e0b', fontWeight: 700 }}><i className="fa-solid fa-clock" style={{ marginRight: 5 }} />Pending</span>
                  }
                </span>
              </div>
              {order.deliveredAt && (
                <div className="order-info-line">
                  <span>Delivered On</span>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>
                    {new Date(order.deliveredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              )}
            </div>

            {order.notes && (
              <div style={{ marginTop: 14, padding: '12px 14px', background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 9, fontSize: 13 }}>
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
