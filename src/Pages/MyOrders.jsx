import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../utils/api'
import OrderTracker from '../Components/OrderTracker'

const STATUS_STYLE = {
  pending:    { bg: '#fef3c7', color: '#92400e',  icon: 'fa-clock' },
  confirmed:  { bg: '#dbeafe', color: '#1e40af',  icon: 'fa-circle-check' },
  processing: { bg: '#e0e7ff', color: '#3730a3',  icon: 'fa-gear' },
  shipped:    { bg: '#d1fae5', color: '#065f46',  icon: 'fa-truck' },
  delivered:  { bg: '#bbf7d0', color: '#14532d',  icon: 'fa-box-open' },
  cancelled:  { bg: '#fee2e2', color: '#991b1b',  icon: 'fa-xmark-circle' },
}

function MyOrders() {
  const [orders, setOrders]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [expanded, setExpanded] = useState(null) // order._id of expanded card

  const fetchOrders = () => {
    setLoading(true)
    setError(null)
    API.get('/orders/my')
      .then(({ data }) => { if (data.success) setOrders(data.orders) })
      .catch(() => setError('Failed to load your orders. Please try again.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [])

  const imgSrc = (img) => {
    if (!img) return '/assets/images/best-product1.png'
    if (img.startsWith('/uploads')) return `${import.meta.env.VITE_API_URL}${img}`
    return img
  }

  const toggleExpand = (id) => setExpanded(prev => prev === id ? null : id)

  return (
    <div style={{ padding: '40px 0 80px', background: '#f8fafc', minHeight: '70vh' }}>
      <div className="container">

        {/* ── Banner ── */}
        <div style={{
          background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
          borderRadius: 16, padding: '28px 32px', marginBottom: 28, color: '#fff',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              <i className="fa-solid fa-bag-shopping" style={{ marginRight: 10 }} />
              My Orders
            </h1>
            <p style={{ fontSize: 13.5, opacity: 0.9, margin: '0 0 10px' }}>
              Track your orders and view full delivery status
            </p>
            <div style={{ fontSize: 12.5, opacity: 0.8, display: 'flex', gap: 6 }}>
              <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
              <span>›</span><span>My Orders</span>
            </div>
          </div>
          <div style={{ position: 'absolute', top: -30, right: -20, width: 140, height: 140, background: 'rgba(255,255,255,0.07)', borderRadius: '50%' }} />
        </div>

        {/* ── States ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#888' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 36, marginBottom: 14, display: 'block', color: '#0f766e' }} />
            <p>Loading your orders...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <i className="fa-solid fa-circle-exclamation" style={{ fontSize: 40, color: '#ef4444', marginBottom: 14, display: 'block' }} />
            <p style={{ color: '#ef4444', fontWeight: 600, marginBottom: 16 }}>{error}</p>
            <button onClick={fetchOrders} style={{ padding: '10px 24px', background: '#0f766e', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <i className="fa-solid fa-bag-shopping" style={{ fontSize: 48, color: '#d1d5db', marginBottom: 16, display: 'block' }} />
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 8 }}>No Orders Yet</h3>
            <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>You haven't placed any orders yet.</p>
            <Link to="/shop" style={{ padding: '12px 28px', background: '#0f766e', color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
              Browse Products
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Summary count */}
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>
              {orders.length} order{orders.length !== 1 ? 's' : ''} found
            </p>

            {orders.map((order) => {
              const st       = STATUS_STYLE[order.orderStatus] || STATUS_STYLE.pending
              const isOpen   = expanded === order._id

              return (
                <div
                  key={order._id}
                  style={{
                    background: '#fff',
                    border: `1px solid ${isOpen ? '#0f766e55' : '#e5e7eb'}`,
                    borderRadius: 14,
                    overflow: 'hidden',
                    boxShadow: isOpen ? '0 4px 20px rgba(15,118,110,0.1)' : '0 1px 4px rgba(0,0,0,0.05)',
                    transition: 'all 0.25s',
                  }}
                >
                  {/* ── Card Header ── */}
                  <div
                    onClick={() => toggleExpand(order._id)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '16px 20px', cursor: 'pointer',
                      background: isOpen ? '#f0fdf4' : '#f8fafc',
                      borderBottom: isOpen ? '1px solid #d1fae5' : '1px solid #f1f5f9',
                      flexWrap: 'wrap', gap: 10,
                    }}
                  >
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
                      {/* Order ID */}
                      <div>
                        <span style={{ fontSize: 10.5, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order ID</span>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: '2px 0 0', fontFamily: 'monospace' }}>
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      {/* Date */}
                      <div>
                        <span style={{ fontSize: 10.5, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</span>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '2px 0 0' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      {/* Items */}
                      <div>
                        <span style={{ fontSize: 10.5, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Items</span>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '2px 0 0' }}>
                          {order.orderItems?.length} item{order.orderItems?.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      {/* Total */}
                      <div>
                        <span style={{ fontSize: 10.5, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total</span>
                        <p style={{ fontSize: 14, fontWeight: 800, color: '#0f766e', margin: '2px 0 0' }}>
                          ${order.totalPrice?.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {/* Status badge */}
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '5px 14px', borderRadius: 20,
                        background: st.bg, color: st.color,
                        fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
                      }}>
                        <i className={`fa-solid ${st.icon}`} />
                        {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                      </span>
                      {/* Expand arrow */}
                      <i
                        className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'}`}
                        style={{ color: '#9ca3af', fontSize: 13, transition: 'transform 0.2s' }}
                      />
                    </div>
                  </div>

                  {/* ── Compact tracker (always visible) ── */}
                  <div style={{ padding: '0 20px' }}>
                    <OrderTracker
                      status={order.orderStatus}
                      createdAt={order.createdAt}
                      deliveredAt={order.deliveredAt}
                      compact={true}
                    />
                  </div>

                  {/* ── Expandable detail ── */}
                  {isOpen && (
                    <div style={{
                      borderTop: '1px solid #e5e7eb',
                      animation: 'fadeSlideDown 0.2s ease',
                    }}>
                      <style>{`@keyframes fadeSlideDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>

                      {/* Full tracker */}
                      <div style={{ padding: '0 20px 4px' }}>
                        <OrderTracker
                          status={order.orderStatus}
                          createdAt={order.createdAt}
                          deliveredAt={order.deliveredAt}
                          compact={false}
                        />
                      </div>

                      {/* Items list */}
                      <div style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9' }}>
                        <p style={{ fontSize: 12.5, fontWeight: 700, color: '#374151', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Items Ordered
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {order.orderItems.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <img
                                src={imgSrc(item.image)}
                                alt={item.name}
                                style={{ width: 50, height: 50, objectFit: 'contain', borderRadius: 9, border: '1px solid #e5e7eb', background: '#f9fafb', padding: 3, flexShrink: 0 }}
                              />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: 13.5, fontWeight: 600, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {item.name}
                                </p>
                                <p style={{ fontSize: 12, color: '#6b7280', margin: '2px 0 0' }}>
                                  Qty: {item.qty}
                                  {item.pills ? `  ·  ${item.pills} pills` : ''}
                                  {' '}· ${item.price?.toFixed(2)} each
                                </p>
                              </div>
                              <span style={{ fontSize: 14, fontWeight: 700, color: '#374151', flexShrink: 0 }}>
                                ${(item.qty * item.price).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Price summary */}
                        <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6b7280', marginBottom: 6 }}>
                            <span>Subtotal</span><span>${order.itemsPrice?.toFixed(2)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
                            <span>Shipping</span><span>${order.shippingPrice?.toFixed(2)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 800, color: '#111827' }}>
                            <span>Grand Total</span>
                            <span style={{ color: '#0f766e' }}>${order.totalPrice?.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Shipping + payment info */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderTop: '1px solid #f1f5f9' }}>
                        <div style={{ padding: '14px 20px', borderRight: '1px solid #f1f5f9' }}>
                          <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Delivery Address</p>
                          {order.shippingAddress ? (
                            <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.7 }}>
                              <strong>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</strong><br />
                              <span style={{ color: '#6b7280' }}>{order.shippingAddress.email}</span><br />
                              {order.shippingAddress.city && <>{order.shippingAddress.city}, </>}
                              {order.shippingAddress.state && <>{order.shippingAddress.state} </>}
                              {order.shippingAddress.zip && order.shippingAddress.zip}<br />
                              {order.shippingAddress.country}
                            </div>
                          ) : <span style={{ fontSize: 13, color: '#9ca3af' }}>—</span>}
                        </div>
                        <div style={{ padding: '14px 20px' }}>
                          <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Payment</p>
                          <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.7 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                              <i className="fa-solid fa-credit-card" style={{ color: '#9ca3af', fontSize: 12 }} />
                              <span style={{ textTransform: 'capitalize' }}>{order.paymentMethod}</span>
                              {order.subPaymentMethod && (
                                <span style={{ color: '#6b7280' }}>· {order.subPaymentMethod}</span>
                              )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              {order.isPaid
                                ? <><i className="fa-solid fa-circle-check" style={{ color: '#10b981', fontSize: 12 }} /><span style={{ color: '#10b981', fontWeight: 600 }}>Paid</span></>
                                : <><i className="fa-solid fa-clock" style={{ color: '#f59e0b', fontSize: 12 }} /><span style={{ color: '#f59e0b', fontWeight: 600 }}>Payment Pending</span></>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders
