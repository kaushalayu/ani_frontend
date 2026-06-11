import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'
import { useCart } from '../Context/CartContext'
import API from '../utils/api'
import './MegaMenu.css'

// ─── Category config ─────────────────────────────────────
const CATEGORIES = [
  { label: 'Sleeping Pills', path: '/sleeping-pills', badge: 'sleep aid', color: '#6366f1' },
  { label: 'Painkillers',    path: '/painkillers',    badge: 'painkillers', color: '#0f766e' },
  { label: 'Anxiety Pills',  path: '/anxiety',        badge: 'calm',        color: '#7c3aed' },
]

// ─── Mega Dropdown Component ─────────────────────────────
function ProductMegaMenu() {
  const [open, setOpen]               = useState(false)
  const [activeIdx, setActiveIdx]     = useState(0)
  const [products, setProducts]       = useState({})  // { badge: [...] }
  const [loadingBadge, setLoadingBadge] = useState(null)
  const menuRef = useRef(null)
  const closeTimer = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const fetchCategoryProducts = async (badge) => {
    if (products[badge]) return            // already cached
    setLoadingBadge(badge)
    try {
      const { data } = await API.get(`/products?badge=${encodeURIComponent(badge)}&limit=8&isActive=true`)
      setProducts(prev => ({ ...prev, [badge]: data.products || [] }))
    } catch {
      setProducts(prev => ({ ...prev, [badge]: [] }))
    } finally {
      setLoadingBadge(null)
    }
  }

  const handleMouseEnterTrigger = () => {
    clearTimeout(closeTimer.current)
    setOpen(true)
    fetchCategoryProducts(CATEGORIES[activeIdx].badge)
  }

  const handleMouseLeaveTrigger = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 200)
  }

  const handleMouseEnterMenu = () => {
    clearTimeout(closeTimer.current)
  }

  const handleMouseLeaveMenu = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 200)
  }

  const handleCategoryHover = (idx) => {
    setActiveIdx(idx)
    fetchCategoryProducts(CATEGORIES[idx].badge)
  }

  const activeCat   = CATEGORIES[activeIdx]
  const catProducts = products[activeCat.badge] || []
  const isLoading   = loadingBadge === activeCat.badge

  const getImg = (img) => {
    if (!img) return '/assets/images/best-product1.png'
    if (img.startsWith('/uploads')) return `${import.meta.env.VITE_API_URL}${img}`
    return img
  }

  return (
    <li
      className="nav-item dropdown mega-product-nav"
      ref={menuRef}
      onMouseEnter={handleMouseEnterTrigger}
      onMouseLeave={handleMouseLeaveTrigger}
    >
      {/* Trigger */}
      <span className="nav-link p-0 dropdown-toggle" style={{ cursor: 'pointer' }}>
        Product
      </span>

      {/* Mega Panel */}
      {open && (
        <div
          className="mega-panel"
          onMouseEnter={handleMouseEnterMenu}
          onMouseLeave={handleMouseLeaveMenu}
        >
          {/* Left — category list */}
          <div className="mega-panel__left">
            <p className="mega-panel__heading">Categories</p>
            {CATEGORIES.map((cat, idx) => (
              <div
                key={cat.path}
                className={`mega-cat-item${activeIdx === idx ? ' active' : ''}`}
                style={{ '--cat-color': cat.color }}
                onMouseEnter={() => handleCategoryHover(idx)}
                onClick={() => setOpen(false)}
              >
                <Link to={cat.path} className="mega-cat-item__link">
                  <span className="mega-cat-item__dot" />
                  {cat.label}
                  <i className="fa-solid fa-chevron-right mega-cat-item__arrow" />
                </Link>
              </div>
            ))}
          </div>

          {/* Right — products grid */}
          <div className="mega-panel__right" style={{ '--cat-color': activeCat.color }}>
            <div className="mega-panel__right-header">
              <p className="mega-panel__heading">{activeCat.label}</p>
              <Link
                to={activeCat.path}
                className="mega-panel__view-all"
                onClick={() => setOpen(false)}
              >
                View All <i className="fa-solid fa-arrow-right" />
              </Link>
            </div>

            {isLoading ? (
              <div className="mega-products-loading">
                <i className="fa-solid fa-spinner fa-spin" />
                <span>Loading...</span>
              </div>
            ) : catProducts.length === 0 ? (
              <div className="mega-products-empty">
                <i className="fa-solid fa-box-open" />
                <span>No products yet.<br />Add from Admin Panel.</span>
              </div>
            ) : (
              <div className="mega-products-grid">
                {catProducts.map((p) => {
                  const price = p.hasPillsOptions && p.pillsOptions?.[0]
                    ? p.pillsOptions[0].price
                    : p.price || 0
                  return (
                    <Link
                      key={p._id}
                      to={`/product/${p.slug || p._id}`}
                      className="mega-product-card"
                      onClick={() => setOpen(false)}
                    >
                      <div className="mega-product-card__img">
                        <img src={getImg(p.image)} alt={p.name} />
                      </div>
                      <div className="mega-product-card__info">
                        <span className="mega-product-card__name">{p.name}</span>
                        <span className="mega-product-card__price">${price.toFixed(2)}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </li>
  )
}

// ─── Main Header ─────────────────────────────────────────
function Header() {
  const { isLoggedIn, isAdmin, logout } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="padding-rl float-left w-100">
      <header className="w-100 float-left header-con position-relative main-box">
        <div className="container-fluid">
          <nav className="navbar navbar-expand-lg navbar-light">
            <Link className="navbar-brand" to="/">
              <figure className="mb-0">
                <img src="/assets/images/logo.png" alt="logo-icon" />
              </figure>
            </Link>
            <button
              className="navbar-toggler collapsed"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
              <span className="navbar-toggler-icon" />
              <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav m-auto">
                <li className="nav-item mr-0">
                  <NavLink className={({ isActive }) => isActive ? 'nav-link p-0 active' : 'nav-link p-0'} to="/" end>Home</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => isActive ? 'nav-link p-0 active' : 'nav-link p-0'} to="/about">About</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => isActive ? 'nav-link p-0 active' : 'nav-link p-0'} to="/shop">Shop</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => isActive ? 'nav-link p-0 active' : 'nav-link p-0'} to="/services">Service</NavLink>
                </li>

                {/* ─── Mega Dropdown ─── */}
                <ProductMegaMenu />

                <li className="nav-item">
                  <NavLink className={({ isActive }) => isActive ? 'nav-link p-0 active' : 'nav-link p-0'} to="/faq">FAQ</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => isActive ? 'nav-link p-0 active' : 'nav-link p-0'} to="/blog">Blog</NavLink>
                </li>
              </ul>
            </div>

            {/* Right side */}
            <div className="header-contact d-flex align-items-center">
              <div className="last_list">
                <a className="search ml-0" href="#search">
                  <img src="/assets/images/header-search.png" alt="search" />
                </a>
                <Link className="cart" to="/wishlist">
                  <i className="fa-regular fa-heart" style={{ fontSize: 20, color: '#0f0200' }} />
                </Link>
                <Link className="cart" to="/cart">
                  <img src="/assets/images/header-cart.png" alt="cart" />
                  <span>{cart.length}</span>
                </Link>
                {isLoggedIn ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        style={{ fontSize: 12, fontWeight: 600, color: '#4f8ef7', textDecoration: 'none', padding: '4px 10px', border: '1px solid #4f8ef7', borderRadius: 6 }}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#666', fontWeight: 600 }}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link className="admin mr-0" to="/login">
                    <img src="/assets/images/header-admin.png" alt="login" />
                  </Link>
                )}
              </div>
              <ul className="list-unstyled mb-0">
                <li className="d-inline-block">
                  <Link to="/contact" className="contact-btn d-inline-block">Contact Us</Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>
    </div>
  )
}

export default Header
