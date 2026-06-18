import { useState, useRef, useCallback, useEffect } from 'react'
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
  const [seoSettings, setSeoSettings] = useState(null)

  const fnameRef = useRef(null)
  const lnameRef = useRef(null)
  const emailRef = useRef(null)
  const stateRef = useRef(null)
  const cityRef = useRef(null)
  const zipRef = useRef(null)
  const cardNameRef = useRef(null)
  const cardNumberRef = useRef(null)
  const cardExpiryRef = useRef(null)
  const cardCvvRef = useRef(null)

  useEffect(() => {
    API.get('/seo')
      .then(({ data }) => {
        if (data.seo) setSeoSettings(data.seo)
      })
      .catch(() => {})
  }, [])

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
    if (selectedPay === 'card') {
      const cardName = cardNameRef.current?.value.trim() || ''
      const cardNumber = cardNumberRef.current?.value.replace(/\s/g, '') || ''
      const cardExpiry = cardExpiryRef.current?.value.trim() || ''
      const cardCvv = cardCvvRef.current?.value.trim() || ''
      if (!cardName) errors.cardName = 'Name on card is required'
      if (!cardNumber || cardNumber.length < 13) errors.cardNumber = 'Valid card number is required'
      if (!cardExpiry) errors.cardExpiry = 'Expiry date is required'
      else if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) errors.cardExpiry = 'Use MM/YY format'
      if (!cardCvv || cardCvv.length < 3) errors.cardCvv = 'Valid CVV is required'
    }
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
        cardDetails: selectedPay === 'card' ? {
          nameOnCard: cardNameRef.current?.value.trim() || '',
          lastFourDigits: (cardNumberRef.current?.value.replace(/\s/g, '') || '').slice(-4),
          expiryDate: cardExpiryRef.current?.value.trim() || '',
        } : undefined,
      }

      const { data: orderResponse } = await API.post('/orders', orderData)

      // 2. Clear cart
      clearCart()

      const customerName = `${fname} ${lname}`

      if (selectedPay === 'card' || selectedPay === 'bitcoin') {
        alert('Thank you, we will contact you soon')
        navigate('/thank-you', {
          state: {
            orderId: orderResponse?.order?._id || null,
            customerName,
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
        return
      }

      // 3. Build WhatsApp / Email message
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

      // 4. Send via WhatsApp or Email
      const waNumber = seoSettings?.whatsappNumber || '61383766284'
      const supportEmail = seoSettings?.supportEmail || 'support@pharmez.com'
      if (selectedPay === 'whatsapp') {
        window.open('https://wa.me/' + waNumber + '?text=' + encodeURIComponent(message), '_blank')
      } else {
        const subject = encodeURIComponent(`New Order from ${customerName}`)
        const body = encodeURIComponent(message)
        window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`
      }

      // 5. Redirect to thank you page — pass order summary
      navigate('/thank-you', {
        state: {
          orderId: orderResponse?.order?._id || null,
          customerName,
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
                  <button
                    type="button"
                    className={'pay-btn' + (selectedPay === 'card' ? ' active' : '')}
                    onClick={() => setSelectedPay('card')}
                  >
                    <i className="fa-regular fa-credit-card" /> Pay via Card
                  </button>
                  <button
                    type="button"
                    className={'pay-btn' + (selectedPay === 'bitcoin' ? ' active' : '')}
                    onClick={() => setSelectedPay('bitcoin')}
                  >
                    <i className="fa-brands fa-bitcoin" /> Pay with Bitcoin
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

                {selectedPay === 'card' && (
                  <div className="card-form-section">
                    <p className="card-form-label">Enter your card details:</p>
                    <div className="form-group">
                      <label htmlFor="cardName">Name on Card *</label>
                      <input
                        type="text"
                        id="cardName"
                        ref={cardNameRef}
                        defaultValue={user?.name || ''}
                        placeholder="John Doe"
                        style={formErrors.cardName ? { borderColor: '#ef4444' } : {}}
                      />
                      {formErrors.cardName && <span style={{ color: '#ef4444', fontSize: 12 }}>{formErrors.cardName}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="cardNumber">Card Number *</label>
                      <input
                        type="text"
                        id="cardNumber"
                        ref={cardNumberRef}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        onInput={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 16)
                          e.target.value = val.replace(/(.{4})/g, '$1 ').trim()
                        }}
                        style={formErrors.cardNumber ? { borderColor: '#ef4444' } : {}}
                      />
                      {formErrors.cardNumber && <span style={{ color: '#ef4444', fontSize: 12 }}>{formErrors.cardNumber}</span>}
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="cardExpiry">Expiry Date *</label>
                        <input
                          type="text"
                          id="cardExpiry"
                          ref={cardExpiryRef}
                          placeholder="MM/YY"
                          maxLength={5}
                          onInput={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 4)
                            if (val.length > 2) {
                              e.target.value = val.slice(0, 2) + '/' + val.slice(2)
                            } else {
                              e.target.value = val
                            }
                          }}
                          style={formErrors.cardExpiry ? { borderColor: '#ef4444' } : {}}
                        />
                        {formErrors.cardExpiry && <span style={{ color: '#ef4444', fontSize: 12 }}>{formErrors.cardExpiry}</span>}
                      </div>
                      <div className="form-group">
                        <label htmlFor="cardCvv">CVV *</label>
                        <input
                          type="text"
                          id="cardCvv"
                          ref={cardCvvRef}
                          placeholder="123"
                          maxLength={4}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4)
                          }}
                          style={formErrors.cardCvv ? { borderColor: '#ef4444' } : {}}
                        />
                        {formErrors.cardCvv && <span style={{ color: '#ef4444', fontSize: 12 }}>{formErrors.cardCvv}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {selectedPay === 'bitcoin' && (
                  <div className="bitcoin-section">
                    <p className="bitcoin-label">Pay with Bitcoin:</p>
                    {seoSettings?.bitcoinAddress ? (
                      <>
                        <p className="bitcoin-desc">
                          Send the exact total amount to the Bitcoin address below. Once confirmed, we will process your order.
                        </p>
                        <div className="bitcoin-address-box">
                          <div className="bitcoin-qr">
                            <img
                              src={`https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${seoSettings.bitcoinAddress}&choe=UTF-8`}
                              alt="Bitcoin QR Code"
                            />
                          </div>
                          <div className="bitcoin-address-text">
                            <strong>Bitcoin Address:</strong>
                            <code>{seoSettings.bitcoinAddress}</code>
                            <button
                              type="button"
                              className="bitcoin-copy-btn"
                              onClick={() => {
                                navigator.clipboard.writeText(seoSettings.bitcoinAddress)
                                alert('Bitcoin address copied!')
                              }}
                            >
                              <i className="fa-regular fa-copy" /> Copy Address
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="bitcoin-desc" style={{ color: '#ef4444' }}>
                        Bitcoin payment is currently unavailable. Please choose another method.
                      </p>
                    )}
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
