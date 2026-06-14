import { useState, useRef, useCallback } from 'react'
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
  const [formErrors, setFormErrors] = useState({})

  const fnameRef = useRef(null)
  const lnameRef = useRef(null)
  const emailRef = useRef(null)
  const stateRef = useRef(null)
  const cityRef = useRef(null)
  const zipRef = useRef(null)

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const shipping = cart.length > 0 ? 8.00 : 0
  const grandTotal = subtotal + shipping

  const handlePlaceOrder = useCallback(async () => {
    const fname = fnameRef.current?.value.trim() || ''
    const lname = lnameRef.current?.value.trim() || ''
    const email = emailRef.current?.value.trim() || ''

    const errors = {}
    if (!fname) errors.fname = 'First name is required'
    if (!lname) errors.lname = 'Last name is required'
    if (!email) errors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Invalid email format'
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return

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

      const { data: orderResponse } = await API.post('/orders', orderData)

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
        window.location.href = `mailto:support@pharmez.com?subject=${subject}&body=${body}`
      }

      // 5. Redirect to thank you page — pass order summary
      navigate('/thank-you', {
        state: {
          orderId: orderResponse?.order?._id || null,
          customerName: `${fname} ${lname}`,
          email,
          items: cart.map(item => ({
            name: item.name,
            qty: item.qty,
            price: item.price,
            pills: item.pills || null,
          })),
          total: grandTotal,
          paymentMethod: selectedPay,
        },
      })

    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Failed to place order. Please try again.')
    } finally {
      setPlacing(false)
    }
  }, [cart, clearCart, selectedPay, selectedSubPay, grandTotal, subtotal, shipping, navigate])

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
                      style={formErrors.fname ? { borderColor: '#ef4444' } : {}}
                    />
                    {formErrors.fname && <span style={{ color: '#ef4444', fontSize: 12 }}>{formErrors.fname}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="lname">Last name *</label>
                    <input
                      type="text"
                      id="lname"
                      ref={lnameRef}
                      defaultValue={user?.name?.split(' ').slice(1).join(' ') || ''}
                      style={formErrors.lname ? { borderColor: '#ef4444' } : {}}
                    />
                    {formErrors.lname && <span style={{ color: '#ef4444', fontSize: 12 }}>{formErrors.lname}</span>}
                  </div>
                </div>
                <div className="form-group full">
                  <label htmlFor="email">Email address *</label>
                  <input
                    type="email"
                    id="email"
                    ref={emailRef}
                    defaultValue={user?.email || ''}
                    style={formErrors.email ? { borderColor: '#ef4444' } : {}}
                  />
                  {formErrors.email && <span style={{ color: '#ef4444', fontSize: 12 }}>{formErrors.email}</span>}
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>State</label>
                    <select ref={stateRef} defaultValue="">
                      <option value="" disabled hidden>Select State</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                      <option value="Assam">Assam</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Chhattisgarh">Chhattisgarh</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Goa">Goa</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Himachal Pradesh">Himachal Pradesh</option>
                      <option value="Jharkhand">Jharkhand</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Manipur">Manipur</option>
                      <option value="Meghalaya">Meghalaya</option>
                      <option value="Mizoram">Mizoram</option>
                      <option value="Nagaland">Nagaland</option>
                      <option value="Odisha">Odisha</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Sikkim">Sikkim</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Tripura">Tripura</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Uttarakhand">Uttarakhand</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      placeholder="Enter your city"
                      ref={cityRef}
                    />
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
