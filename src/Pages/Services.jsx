import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../utils/api'
import { useCart } from '../Context/CartContext'
import { useWishlist } from '../Context/WishlistContext'
import { useToast } from '../Components/Toast'

function Services() {
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [productCount, setProductCount] = useState(0)
  const [activeTab, setActiveTab] = useState('all')
  const { addToCart } = useCart()
  const { addToWishlist } = useWishlist()
  const { addToast } = useToast()

  useEffect(() => {
    API.get('/services').then(({ data }) => setServices(data.services || [])).catch(() => {})
    API.get('/categories').then(({ data }) => setCategories(data.categories || [])).catch(() => {})
    API.get('/products?limit=20').then(({ data }) => {
      setFeaturedProducts(data.products || [])
      if (data.total) setProductCount(data.total)
    }).catch(() => {})
  }, [])

  const avgRating = featuredProducts.length > 0
    ? (featuredProducts.reduce((sum, p) => sum + (p.rating || 0), 0) / featuredProducts.length).toFixed(0)
    : 99

  const filteredByCategory = (catName) =>
    catName === 'all'
      ? featuredProducts
      : featuredProducts.filter((p) => {
          const c = p.category
          return c && (c.name === catName || c.slug === catName.toLowerCase().replace(/\s+/g, '-'))
        })

  const productImg = (product) => {
    if (!product.image) return '/assets/images/product1.png'
    if (product.image.startsWith('/uploads')) return `${import.meta.env.VITE_API_URL}${product.image}`
    return product.image
  }

  const productLink = (product) => `/product/${product.slug || product._id}`

  const truncate = (str, len) => (str && str.length > len ? str.slice(0, len) + '...' : str)

  return (
    <>
      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 sub-banner-con position-relative d-flex align-items-center justify-content-center br-30">
          <div className="main-container">
            <div className="col-xl-12 col-lg-12 mr-auto ml-auto">
              <div className="sub-banner-inner-con text-center">
                <h1>Services</h1>
                <p>Trusted source for prescription and over-the-counter medicines — delivered <br />with care and confidence.</p>
                <div className="breadcrumb-con d-inline-block">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Services</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SERVICES INTRO */}
      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 srv-intro-con">
          <div className="main-container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="srv-intro-content">
                  <span className="srv-section-tag">What We Offer</span>
                  <h2>Comprehensive <span>Healthcare</span> Services</h2>
                  <p>From prescription medicines to wellness supplements, we provide end-to-end pharmaceutical care with expert guidance, fast delivery, and unwavering quality — because your health is our priority.</p>
                  <div className="srv-intro-stats">
                    <div className="srv-stat-item">
                      <span className="srv-stat-num">{services.length > 0 ? services.length + '+' : '5+'}</span>
                      <span className="srv-stat-label">Services</span>
                    </div>
                    <div className="srv-stat-item">
                      <span className="srv-stat-num">{productCount > 0 ? productCount + '+' : '30+'}</span>
                      <span className="srv-stat-label">Products</span>
                    </div>
                    <div className="srv-stat-item">
                      <span className="srv-stat-num">{avgRating}%</span>
                      <span className="srv-stat-label">Satisfaction</span>
                    </div>
                  </div>
                  <Link to="/shop" className="srv-primary-btn">Explore Products <i className="fa-solid fa-arrow-right" /></Link>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="srv-intro-image">
                  <img src="/assets/images/popular-category1.jpg" alt="Healthcare" className="img-fluid srv-intro-main-img" />
                  <div className="srv-intro-badge">
                    <i className="fa-solid fa-truck" />
                    <span>Free Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SERVICES CARDS */}
      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 srv-cards-con">
          <div className="main-container">
            <div className="text-center">
              <span className="srv-section-tag">Our Services</span>
              <h2>Everything You Need <span>Under One Roof</span></h2>
              <p className="srv-cards-desc">We cover every aspect of your pharmaceutical needs with care and professionalism</p>
            </div>
            {services.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 32, marginBottom: 12 }} />
                <p>Loading services...</p>
              </div>
            ) : (
              <div className="row">
                {services.map((service) => (
                  <div key={service._id} className="col-lg-4 col-md-6">
                    <div className="srv-card">
                      <div className="srv-card-icon"><i className={service.icon} /></div>
                      <h4>{service.title}</h4>
                      <p>{service.description}</p>
                      <Link to="/shop">Learn More <i className="fa-solid fa-arrow-right" /></Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* FEATURED PRODUCTS SECTION */}
      <div className="padding-rl float-left w-100">
        <section className="position-relative padding-top padding-bottom services-featured-section">
          <div className="main-container">
            <div className="services-featured-header text-center">
              <span className="services-featured-tag">Best Items</span>
              <h2 className="mb-0">Our Featured Products</h2>
              <p className="services-featured-desc">Premium healthcare solutions tailored to your needs</p>
            </div>
            {featuredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 32, marginBottom: 12 }} />
                <p>Loading featured products...</p>
              </div>
            ) : (
              <div className="services-featured-tabs">
                <div className="services-tab-nav">
                  <a className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>All</a>
                  {categories.map((cat) => (
                    <a key={cat._id} className={activeTab === cat.name ? 'active' : ''} onClick={() => setActiveTab(cat.name)}>{cat.name}</a>
                  ))}
                </div>
                <div className="services-tab-content">
                  <div className="services-tab-pane active">
                    <div className="row">
                      {filteredByCategory(activeTab).slice(0, 8).map((product) => {
                        const displayPrice = product.hasPillsOptions && product.pillsOptions?.length > 0
                          ? product.pillsOptions[0].price
                          : product.price || 0
                        return (
                          <div key={product._id} className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 d-flex">
                            <div className="premium-card w-100">
                              <div className="premium-card-img">
                                <Link to={productLink(product)}>
                                  <figure className="mb-0">
                                    <img src={productImg(product)} alt={product.name} className="img-fluid" />
                                  </figure>
                                </Link>
                                {product.badge && <div className="premium-card-badge">{product.badge}</div>}
                                <button className="premium-card-wishlist" aria-label="Add to wishlist" onClick={() => { addToWishlist({ id: product._id, name: product.name, price: displayPrice, img: productImg(product), pills: product.badge || '' }); addToast('Added to wishlist') }}><i className="fa-regular fa-heart" /></button>
                              </div>
                              <div className="premium-card-body">
                                <div className="premium-card-rating">
                                  <i className="fa-solid fa-star" />
                                  <span>{product.rating ? `${product.rating.toFixed(1)}/5` : '0/5'}</span>
                                </div>
                                <h5 className="premium-card-title">
                                  <Link to={productLink(product)}>{truncate(product.name, 30)}</Link>
                                </h5>
                                <div className="premium-card-footer">
                                  <span className="premium-card-price">${displayPrice.toFixed(2)}</span>
                                  <button className="premium-card-cart" aria-label="Add to cart" onClick={() => { addToCart({ id: product._id, name: product.name, price: displayPrice, img: productImg(product), pills: product.badge || '', qty: 1 }); addToast('Added to cart', 'cart') }} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><i className="fa-solid fa-cart-plus" /></button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      {filteredByCategory(activeTab).length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#888', width: '100%' }}>
                          <p>No products found in this category.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

export default Services
