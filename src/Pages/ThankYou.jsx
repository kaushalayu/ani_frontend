import { Link, useLocation } from 'react-router-dom'

function ThankYou() {
  const { state } = useLocation()

  // state is passed from Checkout on successful order
  const order = state || null

  return (
    <>
      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 position-relative thank-you-con padding-top125 padding-bottom150 text-center">
          <div className="main-container">
            <div className="thankyou-content-con">
              <figure>
                <img src="/assets/images/smile-image.png" alt="smile icon" className="img-fluid" />
              </figure>
              <h1 className="text-black">Thank You!</h1>
              <p>
                Thank you for your order! We're committed to your health and well-being, and we can't wait for<br />
                you to experience our trusted pharmacy care. Your satisfaction is our top priority.
              </p>

              {/* ── Order Summary Card ── */}
              {order && (
                <div style={{
                  maxWidth: 520,
                  margin: '32px auto 0',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: 14,
                  padding: '28px 32px',
                  textAlign: 'left',
                }}>
                  <h4 style={{ fontWeight: 700, color: '#111827', marginBottom: 4, fontSize: 17 }}>
                    Order Confirmation
                  </h4>
                  {order.orderId && (
                    <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
                      Order ID: <strong style={{ color: '#374151' }}>#{order.orderId.slice(-8).toUpperCase()}</strong>
                    </p>
                  )}

                  {/* Customer */}
                  <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #e5e7eb' }}>
                    <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                      <strong>Customer:</strong> {order.customerName}
                    </p>
                    <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}>
                      <strong>Email:</strong> {order.email}
                    </p>
                    {order.paymentMethod && (
                      <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}>
                        <strong>Payment:</strong> via {order.paymentMethod === 'whatsapp' ? 'WhatsApp' : 'Email'}
                      </p>
                    )}
                  </div>

                  {/* Items */}
                  {order.items && order.items.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>Items Ordered:</p>
                      {order.items.map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#4b5563', marginBottom: 6 }}>
                          <span>
                            {item.qty} × {item.name}
                            {item.pills ? <span style={{ color: '#9ca3af' }}> ({item.pills} pills)</span> : null}
                          </span>
                          <span style={{ fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Total */}
                  {order.total != null && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #e5e7eb' }}>
                      <span style={{ fontWeight: 700, color: '#111827' }}>Grand Total</span>
                      <span style={{ fontWeight: 700, color: '#0f766e', fontSize: 16 }}>${order.total.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}

              <div style={{ marginTop: 32 }}>
                <Link to="/" className="text-decoration-none primary_btn d-inline-block">Back to Home</Link>
                <Link to="/shop" className="text-decoration-none" style={{ marginLeft: 16, color: '#0f766e', fontWeight: 600, fontSize: 14 }}>
                  Continue Shopping →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default ThankYou
