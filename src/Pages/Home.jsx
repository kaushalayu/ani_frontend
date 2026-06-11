import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

const categories = [
  { name: 'Nutrition & Weight', img: 'assets/images/popular-category1.jpg' },
  { name: 'Skin Essentials', img: 'assets/images/popular-category2.jpg' },
  { name: 'Vitamins & Minerals', img: 'assets/images/popular-category3.jpg' },
  { name: 'Cold & Flu Care', img: 'assets/images/popular-category4.jpg' },
]

const tabData = [
  { id: 'all', label: 'All' },
  { id: 'cardiology', label: 'Cardiology' },
  { id: 'neurology', label: 'Neurology' },
  { id: 'pediatrics', label: 'Pediatrics' },
  { id: 'gynecology', label: 'Gynecology' },
]

const featuredProducts = [
  { name: 'VitalEase Multivitamins', type: 'Supplement', price: 63, img: 'assets/images/product1.png', rating: 4.8 },
  { name: 'DermaGlow Skin Cream', type: 'Healthy Skin', price: 84, img: 'assets/images/product2.png', rating: 4.8 },
  { name: 'CalmFlu Relief Syrup', type: 'Flu Remedy', price: 96, img: 'assets/images/product3.png', rating: 4.8 },
  { name: 'NutriSlim Capsules', type: 'Herbal', price: 42, img: 'assets/images/product4.png', rating: 4.8 },
]

const bestSellers = [
  { name: 'ImmunoBoost', type: 'Vitamin', price: 63, img: 'assets/images/best-product1.png', rating: 4.8 },
  { name: 'MetaboTrim', type: 'Herbal', price: 87, img: 'assets/images/best-product2.png', rating: 4.8 },
  { name: 'DermaGlow', type: 'Cream', price: 55, img: 'assets/images/best-product3.png', rating: 4.8 },
  { name: 'CoughRelief Max', type: 'Syrup', price: 42, img: 'assets/images/best-product4.png', rating: 4.8 },
  { name: 'NutriCore Essentials', type: 'Vitamin', price: 12, img: 'assets/images/best-product5.png', rating: 4.8 },
  { name: 'Slimvia Burn', type: 'Herbal', price: 26, img: 'assets/images/best-product6.png', rating: 4.8 },
  { name: 'AcneShield Gel', type: 'Cream', price: 82, img: 'assets/images/best-product7.png', rating: 4.8 },
  { name: 'FluAway Tabs', type: 'Tablet', price: 36, img: 'assets/images/best-product8.png', rating: 4.8 },
]

const whyChooseUs = [
  { icon: 'assets/images/product-icon1.png', title: 'Certified Pharmacists', desc: 'Licensed experts verify every prescription before dispatch.' },
  { icon: 'assets/images/product-icon2.png', title: '100% Quality Assured', desc: 'All medicines are sourced from verified & trusted manufacturers.' },
  { icon: 'assets/images/benefits-icon1.png', title: 'Free Fast Delivery', desc: 'Get your order delivered to your doorstep — absolutely free.' },
  { icon: 'assets/images/benefits-icon4.png', title: '24/7 Customer Care', desc: 'Our support team is available round the clock to help you.' },
]

const blogPosts = [
  { tag: 'Immunity', title: '5 Natural Ways to Strengthen Your Immune System', img: 'assets/images/news-and-articles-img1.jpg', excerpt: 'Discover simple lifestyle habits and key supplements that can naturally boost your immunity every day.' },
  { tag: 'Skincare', title: 'Skincare Advice for Sensitive Skin: Simple Tips for a Calmer Complexion', img: 'assets/images/news-and-articles-img2.jpg', excerpt: 'Learn how to care for sensitive skin with gentle routines and dermatologist-recommended products.' },
  { tag: 'Supplements', title: 'Do You Really Need Supplements? A Practical Guide to Boosting Your Health', img: 'assets/images/news-and-articles-img3.jpg', excerpt: 'Find out when supplements are helpful and how to choose the right ones for your health needs.' },
]

const processSteps = [
  { icon: 'assets/images/work-icon2.png', title: 'Choose Your Products', desc: 'Browse and select the medicines or health products you need from our extensive catalog.' },
  { icon: 'assets/images/work-icon3.png', title: 'Upload Prescription', desc: 'Upload a valid prescription from your doctor for prescription-only medicines.' },
  { icon: 'assets/images/capsule-icon.png', title: 'Get It Delivered', desc: 'Receive your order at your doorstep — fast, safe, and hassle-free.' },
]

function Toast({ message, type, onClose }) {
  return (
    <div className={`toast-notification toast-${type}`}>
      <i className={`fa-solid ${type === 'cart' ? 'fa-cart-shopping' : 'fa-heart'}`}></i>
      {message}
    </div>
  )
}

function StarRating({ rating }) {
  return (
    <div className="star-rating">
      {[...Array(5)].map((_, i) => (
        <i key={i} className={`fa-solid fa-star${i < Math.floor(rating) ? '' : i < rating ? '-half-alt' : '-o'}`}></i>
      ))}
      <span>{rating}/5</span>
    </div>
  )
}

function ProductCard({ product, onAddToCart, onAddToWishlist }) {
  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img src={product.img} alt={product.name} />
        <span className="product-badge">{product.type}</span>
        <button className="wishlist-btn" onClick={() => onAddToWishlist(product.name)}><i className="fa-regular fa-heart"></i></button>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <StarRating rating={product.rating} />
        <div className="product-price-row">
          <span className="product-price">${product.price}.00</span>
          <button className="add-to-cart-btn" onClick={() => onAddToCart(product.name)}>Add to cart</button>
        </div>
      </div>
    </div>
  )
}

function Home() {
  const [activeTab, setActiveTab] = useState('all')
  const [toast, setToast] = useState(null)

  function showToast(type, productName) {
    setToast({ type, message: type === 'cart' ? `${productName} added to cart` : `${productName} added to wishlist` })
    setTimeout(() => setToast(null), 2500)
  }

  return (
    <>
      {/* ===== HERO ===== */}
      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 hero-section position-relative d-flex align-items-center br-30">
          <div className="hero-bg-circle hero-bg-circle-1"></div>
          <div className="hero-bg-circle hero-bg-circle-2"></div>
          <div className="wrapper1560 position-relative">
            <div className="hero-content">
              <span className="hero-tag">
                <i className="fa-solid fa-circle-check"></i> Trusted Online Pharmacy
              </span>
              <h1 className="hero-title">Fast &amp; Trusted<br />Medicine Delivery</h1>
              <p className="hero-desc">Upload your prescription &amp; get medicines delivered to your doorstep. Safe, reliable &amp; always on time.</p>
              <div className="hero-btns">
                <Link to="/shop" className="hero-btn-primary">Shop Medicines</Link>
              </div>
              <div className="hero-stats">
                <div className="hero-stat-item">
                  <span className="hero-stat-num">10k+</span>
                  <span className="hero-stat-label">Happy Clients</span>
                </div>
                <div className="hero-stat-item">
                  <span className="hero-stat-num">500+</span>
                  <span className="hero-stat-label">Medicines</span>
                </div>
                <div className="hero-stat-item">
                  <span className="hero-stat-num">Free</span>
                  <span className="hero-stat-label">Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ===== BENEFITS ===== */}
      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 benefits-con">
          <div className="main-container">
            <div className="benefits-inner-con">
              <ul className="d-flex list-unstyled p-0 mb-0 align-items-center justify-content-between">
                <li className="position-relative d-flex align-items-center">
                  <figure><img src="assets/images/benefits-icon1.png" alt="icon" className="img-fluid" /></figure>
                  <div className="sub-info-inner">
                    <h6>Free Shipping &amp; Returns</h6>
                    <p className="mb-0 sub-p">For all order over $200</p>
                  </div>
                </li>
                <li className="position-relative d-flex align-items-center">
                  <figure><img src="assets/images/benefits-icon2.png" alt="icon" className="img-fluid" /></figure>
                  <div className="sub-info-inner">
                    <h6>Secure Payment</h6>
                    <p className="mb-0 sub-p">Ensure Secure Payment</p>
                  </div>
                </li>
                <li className="position-relative d-flex align-items-center">
                  <figure><img src="assets/images/benefits-icon3.png" alt="icon" className="img-fluid" /></figure>
                  <div className="sub-info-inner">
                    <h6>Money Back Guarantee</h6>
                    <p className="mb-0 sub-p">Returning Money in 30 days</p>
                  </div>
                </li>
                <li className="position-relative d-flex align-items-center">
                  <figure><img src="assets/images/benefits-icon4.png" alt="icon" className="img-fluid" /></figure>
                  <div className="sub-info-inner">
                    <h6>24/7 Customer Support</h6>
                    <p className="mb-0 sub-p">Friendly Customer Support</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* ===== POPULAR CATEGORIES ===== */}
      <section className="home-section section-categories">
        <div className="home-container">
          <div className="section-header">
            <span className="section-subtitle">Top Choices</span>
            <h2 className="section-title">Our Popular Categories</h2>
          </div>
          <div className="categories-grid">
            {categories.map((cat, i) => (
              <Link to="/shop" className="category-card" key={i}>
                <div className="category-image-wrapper">
                  <img src={cat.img} alt={cat.name} />
                  <div className="category-overlay">
                    <span className="category-name">{cat.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="home-section section-process">
        <div className="home-container">
          <div className="section-header">
            <span className="section-subtitle">Our Process</span>
            <h2 className="section-title">How It Works</h2>
          </div>
          <div className="process-grid">
            {processSteps.map((step, i) => (
              <div className="process-step" key={i}>
                <div className="step-number-badge">{String(i + 1).padStart(2, '0')}</div>
                <div className="step-icon-wrap">
                  <img src={step.icon} alt={step.title} />
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="process-cta">
            <Link to="/shop" className="process-btn">Get Started Now</Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="home-section section-featured">
        <div className="home-container">
          <div className="section-header">
            <span className="section-subtitle">Best Items</span>
            <h2 className="section-title">Our Featured Products</h2>
          </div>
          <div className="tab-buttons">
            {tabData.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="product-grid">
            {featuredProducts.map((product, i) => (
              <ProductCard product={product} key={i} onAddToCart={(name) => showToast('cart', name)} onAddToWishlist={(name) => showToast('wishlist', name)} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== BEST SELLING ===== */}
      <section className="home-section section-best">
        <div className="home-container">
          <div className="section-header">
            <span className="section-subtitle">Most Demanding</span>
            <h2 className="section-title">Best Selling Products</h2>
          </div>
          <div className="product-grid">
            {bestSellers.map((product, i) => (
              <ProductCard product={product} key={i} onAddToCart={(name) => showToast('cart', name)} onAddToWishlist={(name) => showToast('wishlist', name)} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="home-section section-why">
        <div className="home-container">
          <div className="section-header">
            <span className="section-subtitle">Why Trust Us</span>
            <h2 className="section-title">Why Thousands Choose Us</h2>
          </div>
          <div className="why-grid">
            {whyChooseUs.map((item, i) => (
              <div className="why-card" key={i}>
                <div className="why-icon-wrap">
                  <img src={item.icon} alt={item.title} />
                </div>
                <h3 className="why-title">{item.title}</h3>
                <p className="why-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROMOTION BANNERS ===== */}
      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 promotion-banner-con position-relative">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-4 col-md-6 d-flex">
                <div className="promotion-box w-100 vitamins">
                  <span className="d-block discount-percent">5%</span>
                  <span className="d-block smol-text">Cashback</span>
                  <h4 className="specialh4">Vitamins &amp; <br />Supplements</h4>
                  <a href="single-product.html" className="text-decoration-none elementary_btn d-inline-block">Browse All</a>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 d-flex">
                <div className="promotion-box w-100 baby-care">
                  <span className="d-block smol-text">Flat</span>
                  <span className="d-block discount-percent">10% <span className="d-inline-block smol-text mb-0">OFF</span></span>
                  <h4 className="specialh4">Baby &amp; <br />Childcare</h4>
                  <a href="single-product.html" className="text-decoration-none elementary_btn d-inline-block">Browse All</a>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 d-flex">
                <div className="promotion-box w-100 personal-care">
                  <span className="d-block discount-percent">12%</span>
                  <span className="d-block smol-text">Cashback</span>
                  <h4 className="specialh4">Personal care <br />&amp; Wellness</h4>
                  <a href="single-product.html" className="text-decoration-none elementary_btn d-inline-block">Browse All</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="spacer"></div>

      {/* ===== TESTIMONIALS ===== */}
      <section className="home-section section-testimonials">
        <div className="home-container">
          <div className="section-header">
            <span className="section-subtitle">Testimonials</span>
            <h2 className="section-title">What Our Clients Say</h2>
          </div>
          <div id="testimonialCarousel" className="carousel slide" data-ride="carousel">
            <div className="carousel-inner">
              {[
                { name: 'Jennifer Troyer', role: 'Administrator', img: 'assets/images/client-img1.jpg' },
                { name: 'Fergus Douchebag', role: 'Happy Customer', img: 'assets/images/client-img2.jpg' },
                { name: 'Lucy Smith', role: 'Satisfied Customer', img: 'assets/images/client-img3.jpg' },
                { name: 'John Smith', role: 'Satisfied Client', img: 'assets/images/client-img4.jpg' },
              ].map((client, i) => (
                <div className={`carousel-item${i === 0 ? ' active' : ''}`} key={i}>
                  <div className="testimonial-card">
                    <div className="testimonial-stars">
                      {[...Array(5)].map((_, si) => (
                        <i key={si} className="fa-solid fa-star"></i>
                      ))}
                    </div>
                    <p className="testimonial-text">"Beatae vitae dicta sunt explicabo nemo enim ipsam voluptatem quia voluptas aspernatur aurodit aut fugit, sed neatae vitae dicta ripiscing elit, sed do euismod tempor incidunt labore are dolore magna aliqua aut enim a minim veniam."</p>
                    <div className="testimonial-author">
                      <img src={client.img} alt={client.name} />
                      <div>
                        <p className="testimonial-name">{client.name}</p>
                        <span className="testimonial-role">{client.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="testimonial-controls">
              <a className="testimonial-arrow testimonial-prev" href="#testimonialCarousel" role="button" data-slide="prev">
                <i className="fa-solid fa-arrow-left"></i>
              </a>
              <a className="testimonial-arrow testimonial-next" href="#testimonialCarousel" role="button" data-slide="next">
                <i className="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BLOG ===== */}
      <section className="home-section section-blog">
        <div className="home-container">
          <div className="section-header">
            <span className="section-subtitle">News &amp; Articles</span>
            <h2 className="section-title">Our Latest Blog Posts</h2>
          </div>
          <div className="blog-grid">
            {blogPosts.map((post, i) => (
              <div className="blog-card" key={i}>
                <div className="blog-image-wrap">
                  <img src={post.img} alt={post.title} />
                  <span className="blog-tag">{post.tag}</span>
                </div>
                <div className="blog-content">
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-excerpt">{post.excerpt}</p>
                  <Link to="/blog" className="blog-link">Read More <i className="fa-solid fa-arrow-right"></i></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  )
}

export default Home
