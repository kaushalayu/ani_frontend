import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../Context/CartContext'
import { useAuth } from '../Context/AuthContext'
import { useToast } from '../Components/Toast'
import './Cart.css'

// Small inline modal to prompt login/register
function LoginPromptModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: 16,
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '36px 32px',
        maxWidth: 420, width: '100%', textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
          Login Required
        </h3>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>
          You need to be logged in to place an order. Please sign in or create a free account.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link
            to="/login"
            style={{
              flex: 1, padding: '12px 0', background: '#4f46e5', color: '#fff',
              borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 15,
              display: 'block', textAlign: 'center',
            }}
          >
            Sign In
          </Link>
          <Link
            to="/join-now"
            style={{
              flex: 1, padding: '12px 0', background: '#f3f4f6', color: '#374151',
              borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 15,
              display: 'block', textAlign: 'center', border: '1px solid #e5e7eb',
            }}
          >
            Register
          </Link>
        </div>
        <button
          onClick={onClose}
          style={{ marginTop: 16, background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: 13 }}
        >
          Continue browsing
        </button>
      </div>
    </div>
  )
}

function Cart() {
  const { cart, removeFromCart, updateQty } = useCart()
  const { isLoggedIn } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const shipping = cart.length > 0 ? 8.00 : 0
  const grandTotal = subtotal + shipping

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }
    navigate('/checkout')
  }

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-banner">
            <h1>Shopping Cart</h1>
            <p>Almost there! Review your items and get ready for fast, safe delivery right to your door.</p>
            <div className="breadcrumb">
              <span className="breadcrumb-item"><Link to="/">Home</Link></span>
              <span className="breadcrumb-item active" aria-current="page">Cart</span>
            </div>
          </div>
          <div className="cart-empty">
            <div className="cart-empty-icon"><i className="fa-solid fa-cart-shopping" /></div>
            <h3>Your cart is empty</h3>
            <p>Add some products to your cart and they will appear here.</p>
            <Link to="/shop" className="cart-shop-btn">Browse Products</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {showLoginModal && <LoginPromptModal onClose={() => setShowLoginModal(false)} />}

      <div className="cart-page">
        <div className="container">
          <div className="cart-banner">
            <h1>Shopping Cart</h1>
            <p>Almost there! Review your items and get ready for fast, safe delivery right to your door.</p>
            <div className="breadcrumb">
              <span className="breadcrumb-item"><Link to="/">Home</Link></span>
              <span className="breadcrumb-item active" aria-current="page">Cart</span>
            </div>
          </div>

          <div className="cart-layout">
            <div className="cart-items-section">
              <div className="cart-items-header">
                <h2>Shopping Cart</h2>
                <span>({cart.length} Item{cart.length !== 1 ? 's' : ''})</span>
              </div>

              <div className="cart-column-labels">
                <span>Product Details</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
                <span></span>
              </div>

              {cart.map((item) => (
                <div key={item.id + (item.pills || '')} className="cart-item">
                  <div className="cart-item-product">
                    <div className="cart-item-image">
                      <img
                        src={item.img?.startsWith('/uploads') ? `http://localhost:5000${item.img}` : item.img}
                        alt={item.name}
                      />
                    </div>
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p>Type: <span>{item.pills || 'General'}</span></p>
                    </div>
                  </div>
                  <div className="cart-item-price">${(item.price || 0).toFixed(2)}</div>
                  <div className="cart-item-quantity">
                    <div className="qty-control">
                      <button onClick={() => updateQty(item.id, item.pills, item.qty - 1)} title="decrease">-</button>
                      <div className="qty-number">{item.qty}</div>
                      <button onClick={() => updateQty(item.id, item.pills, item.qty + 1)} title="increase">+</button>
                    </div>
                  </div>
                  <div className="cart-item-total">${((item.price || 0) * item.qty).toFixed(2)}</div>
                  <div className="cart-item-remove">
                    <button
                      onClick={() => { removeFromCart(item.id, item.pills); addToast('Removed from cart', 'info') }}
                      title="Remove item"
                    >
                      <i className="fas fa-times" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="cart-continue">
                <Link to="/shop"><i className="fa-solid fa-arrow-left" /> Continue Shopping</Link>
              </div>
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>

              <div className="summary-details">
                <span className="summary-label">Product Details:</span>
                <ul>
                  <li><span>Sub Total</span><span>${subtotal.toFixed(2)}</span></li>
                  <li><span>Shipping</span><span>${shipping.toFixed(2)}</span></li>
                </ul>

                <div className="summary-total">
                  <div className="summary-total-row">
                    <span className="label">Grand Total</span>
                    <span className="value">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* THE KEY BUTTON — login check here */}
                <button onClick={handleCheckout} className="checkout-btn" style={{ width: '100%', border: 'none', cursor: 'pointer' }}>
                  Proceed to checkout
                </button>

                {!isLoggedIn && (
                  <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 8 }}>
                    <i className="fa-solid fa-lock" style={{ marginRight: 4 }} />
                    Login required to place order
                  </p>
                )}
              </div>

              <div className="summary-note">
                <i className="fa-solid fa-shield-halved" />
                <span>Safe and Secure Payments, Easy Returns.<br />100% Authentic Products</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Cart
