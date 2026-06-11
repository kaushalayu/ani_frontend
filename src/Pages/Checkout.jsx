import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../Context/CartContext'
import { useAuth } from '../Context/AuthContext'
import API from '../utils/api'
import './Checkout.css'

const subPaymentOptions = [
  { value: 'gpay', label: 'Google Pay', icon: 'fa-brands fa-google' },
  { value: 'phonepe', label: 'PhonePe', icon: 'fa-solid fa-mobile-screen' },
  { value: 'paytm', label: 'Paytm', icon: 'fa-solid fa-wallet' },
  { value: 'bhim', label: 'BHIM UPI', icon: 'fa-solid fa-qrcode' },
  { value: 'card', label: 'Card', icon: 'fa-regular fa-credit-card' },
  { value: 'netbanking', label: 'Net Banking', icon: 'fa-solid fa-building-columns' },
  { value: 'cod', label: 'Cash on Delivery', icon: 'fa-solid fa-hand-holding-dollar' },
]

function Checkout() {
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [selectedPay, setSelectedPay] = useState('whatsapp')
  const [selectedSubPay, setSelectedSubPay] = useState('')
  const [placing, setPlacing] = useState(false)

  const fnameRef = useRef(null)
  const lnameRef = useRef(null)
  const emailRef = useRef(null)
  const stateRef = useRef(null)
  const cityRef = useRef(null)
  const zipRef = useRef(null)

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const shipping = cart.length > 0 ? 8.00 : 0
  const grandTotal = subtotal + shipping

  const handlePlaceOrder = async () => {
    const fname = fnameRef.current.value.trim()
    const lname = lnameRef.current.value.trim()
    const email = emailRef.current.value.trim()

    if (!fname || !lname || !email) {
      alert('Please fill in all required billing fields.')
      return
    }

    if (cart.length === 0) {
      alert('Your cart is empty.')
      return
    }

    setPlacing(true)

    try {
      // 1. Save order to database
      const orderData = {
        orderItems: cart.map((item) => ({
          product: item.id,
          name: item.name,
          image: item.img || '',
          price: item.price,
          pills: item.pills || null,
          qty: item.qty,
        })),
        shippingAddress: {
          firstName: fname,
          lastName: lname,
          email,
          state: stateRef.current?.value || '',
          city: cityRef.current?.value || '',
          zip: zipRef.current?.value || '',
          country: 'India',
        },
        paymentMethod: selectedPay,
        subPaymentMethod: selectedSubPay,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        totalPrice: grandTotal,
      }

      await API.post('/orders', orderData)

      // 2. Build WhatsApp / Email message (same as before)
      const customerName = `${fname} ${lname}`
      let orderItems = ''
      cart.forEach((item) => {
        orderItems += `\u2022 ${item.qty} x ${item.name}${item.pills ? ` (${item.pills} pills)` : ''} .................... $${(item.price * item.qty).toFixed(2)}\n`
      })

      let message = '🛒 *New Order - Pharmez*\n\n'
      message += '━━━━━━━━━━━━━━━━━━\n'
      message += '*Customer Details*\n'
      message += '━━━━━━━━━━━━━━━━━━\n'
      message += `👤 Name: ${customerName}\n`
      message += `📧 Email: ${email}\n`
      if (stateRef.current?.value) message += `📍 State: ${stateRef.current.value}\n`
      if (cityRef.current?.value) message += `🏙️ City: ${cityRef.current.value}\n`
      if (zipRef.current?.value) message += `📮 Zip: ${zipRef.current.value}\n`
      message += '\n━━━━━━━━━━━━━━━━━━\n'
      message += '*Order Details*\n'
      message += '━━━━━━━━━━━━━━━━━━\n'
      message += orderItems
      message += '\n────────────────────\n'
      message += `*Grand Total: $${grandTotal.toFixed(2)}*\n`
      message += '────────────────────\n'
      message += '\n━━━━━━━━━━━━━━━━━━\n'
      message += '*💳 Payment Method:*\n'
      message += '━━━━━━━━━━━━━━━━━━\n'
      message += `✅ Via: ${selectedPay === 'whatsapp' ? 'WhatsApp' : 'Email'}\n`
      if (selectedSubPay) {
        const opt = subPaymentOptions.find((o) => o.value === selectedSubPay)
        message += `✅ Pay Using: ${opt?.label || selectedSubPay}\n`
      }
      message += '\n📲 We will share the payment link/QR shortly.\n'
      message += '\n────────────────────\n'
      message += 'Thank you for choosing Pharmez! 🙏'

      // 3. Clear cart
      clearCart()

      // 4. Send via WhatsApp or Email
      if (selectedPay === 'whatsapp') {
        window.open('https://wa.me/61383766284?text=' + encodeURIComponent(message), '_blank')
      } else {
        const subject = encodeURIComponent(`New Order from ${customerName}`)
        const body = encodeURIComponent(message)
        window.location.href = `mailto:Info@pharmez.com?subject=${subject}&body=${body}`
      }

      // 5. Redirect to thank you page
      navigate('/thank-you')

    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Failed to place order. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-banner">
          <h1>Checkout</h1>
          <p>You're just a step away — complete your order for quick, secure delivery to your doorstep.</p>
          <div className="breadcrumb">
            <span className="breadcrumb-item"><Link to="/">Home</Link></span>
            <span className="breadcrumb-item"><Link to="/cart">Cart</Link></span>
            <span className="breadcrumb-item active" aria-current="page">Checkout</span>
          </div>
        </div>

        <div className="checkout-layout">
          <div className="checkout-form-section">
            <form id="checkoutForm" onSubmit={(e) => e.preventDefault()}>
              <div className="billing-section">
                <h3>Billing Address:</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fname">First name *</label>
                    <input
                      type="text"
                      id="fname"
                      ref={fnameRef}
                      defaultValue={user?.name?.split(' ')[0] || ''}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lname">Last name *</label>
                    <input
                      type="text"
                      id="lname"
                      ref={lnameRef}
                      defaultValue={user?.name?.split(' ').slice(1).join(' ') || ''}
                    />
                  </div>
                </div>
                <div className="form-group full">
                  <label htmlFor="email">Email address *</label>
                  <input
                    type="email"
                    id="email"
                    ref={emailRef}
                    defaultValue={user?.email || ''}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>State</label>
                    <select ref={stateRef} defaultValue="">
                      <option value="" disabled hidden>Select State</option>
                      <option value="California">California</option>
                      <option value="Texas">Texas</option>
                      <option value="Florida">Florida</option>
                      <option value="New York">New York</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <select ref={cityRef} defaultValue="">
                      <option value="" disabled hidden>Select City</option>
                      <option value="Los Angeles">Los Angeles</option>
                      <option value="San Francisco">San Francisco</option>
                      <option value="San Diego">San Diego</option>
                      <option value="Houston">Houston</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-group half">
                  <label htmlFor="code">Zip / postal code</label>
                  <input type="text" id="code" ref={zipRef} />
                </div>
              </div>

              <div className="payment-section">
                <h3>Payment Method:</h3>
                <div className="pay-options">
                  <button
                    type="button"
                    className={'pay-btn' + (selectedPay === 'whatsapp' ? ' active' : '')}
                    onClick={() => setSelectedPay('whatsapp')}
                  >
                    <i className="fa-brands fa-whatsapp" /> Pay via WhatsApp
                  </button>
                  <button
                    type="button"
                    className={'pay-btn' + (selectedPay === 'email' ? ' active' : '')}
                    onClick={() => setSelectedPay('email')}
                  >
                    <i className="fa-regular fa-envelope" /> Pay via Email
                  </button>
                </div>

                {selectedPay === 'whatsapp' && (
                  <div className="sub-pay-section">
                    <p className="sub-pay-label">Choose payment method (optional):</p>
                    <div className="sub-pay-grid">
                      {subPaymentOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          className={'sub-pay-btn' + (selectedSubPay === opt.value ? ' active' : '')}
                          onClick={() => setSelectedSubPay(selectedSubPay === opt.value ? '' : opt.value)}
                        >
                          <i className={opt.icon} /> {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <p className="terms-text">
                  By clicking the button, you agree to the{' '}
                  <Link to="/terms-of-use">Terms and Conditions</Link>
                </p>
              </div>

              <button
                type="button"
                className="place-order-btn"
                onClick={handlePlaceOrder}
                disabled={placing}
              >
                {placing ? 'Placing Order...' : 'Place Order Now'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary">
            <div className="summary-header">
              <span className="summary-label-items">Items</span>
              <span className="summary-label-price">Price</span>
            </div>
            <div className="summary-items">
              {cart.length === 0 ? (
                <div style={{ padding: '20px 16px', color: '#9ca3af', fontSize: 14 }}>
                  Your cart is empty. <Link to="/shop">Browse products</Link>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id + (item.pills || '')} className="each-item">
                    <div className="item-info">
                      <span className="heading">{item.qty} x {item.name}</span>
                      {item.pills && <p>{item.pills} Pills</p>}
                    </div>
                    <span className="dollar">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))
              )}
              <div className="each-item" style={{ borderTop: '1px solid #e5e7eb', marginTop: 8 }}>
                <div className="item-info">
                  <span style={{ fontSize: 13, color: '#6b7280' }}>Shipping</span>
                </div>
                <span className="dollar" style={{ fontSize: 13, color: '#6b7280' }}>${shipping.toFixed(2)}</span>
              </div>
              <div className="each-item total-row">
                <div className="item-info">
                  <span className="heading">Grand Total</span>
                </div>
                <span className="dollar total-price">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
