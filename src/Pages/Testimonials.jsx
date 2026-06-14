import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../utils/api'
import './Testimonials.css'

function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [blogPosts, setBlogPosts] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    API.get('/testimonials').then(({ data }) => setTestimonials(data.testimonials || [])).catch(() => {})
    API.get('/blogs?limit=3').then(({ data }) => setBlogPosts(data.blogs || [])).catch(() => {})
  }, [])

  const items = testimonials.length > 0 ? testimonials : []
  const prev = () => setActiveIndex(i => (i === 0 ? items.length - 1 : i - 1))
  const next = () => setActiveIndex(i => (i === items.length - 1 ? 0 : i + 1))

  const getImg = (img) => {
    if (!img) return '/assets/images/client-img1.jpg'
    if (img.startsWith('/uploads')) return `${import.meta.env.VITE_API_URL}${img}`
    return img
  }

  const getBlogImg = (img) => {
    if (!img) return '/assets/images/news-and-articles-img1.jpg'
    if (img.startsWith('/uploads')) return `${import.meta.env.VITE_API_URL}${img}`
    return img
  }

  return (
    <div className="testimonials-page">
      <div className="container">
        <div className="test-banner">
          <h1>Testimonials</h1>
          <p>Trusted source for prescription and over-the-counter medicines — delivered with care and confidence.</p>
          <div className="breadcrumb">
            <span className="breadcrumb-item"><Link to="/">Home</Link></span>
            <span className="breadcrumb-item active" aria-current="page">Testimonials</span>
          </div>
        </div>

        {/* BENEFITS */}
        <div className="test-benefits">
          {[
            { img: '/assets/images/benefits-icon1.png', title: 'Free Shipping & Returns', desc: 'For all order over $200' },
            { img: '/assets/images/benefits-icon2.png', title: 'Secure Payment', desc: 'Ensure Secure Payment' },
            { img: '/assets/images/benefits-icon3.png', title: 'Money Back Guarantee', desc: 'Returning Money in 30 days' },
            { img: '/assets/images/benefits-icon4.png', title: '24/7 Customer Support', desc: 'Friendly Customer Support' },
          ].map((b, i) => (
            <div key={i} className="test-benefit-item">
              <figure><img src={b.img} alt={b.title} /></figure>
              <div>
                <h6>{b.title}</h6>
                <p>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* TESTIMONIALS CAROUSEL */}
        <div className="test-carousel-section">
          <div className="test-carousel-header">
            <span className="test-special">Testimonials</span>
            <h2>Our Client Reviews</h2>
          </div>

          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 32, marginBottom: 12 }} />
              <p>Loading testimonials...</p>
            </div>
          ) : (
            <>
              <div className="test-carousel-body">
                <img src="/assets/images/left-quote.png" alt="" className="test-quote-left" />
                <img src="/assets/images/right-quote.png" alt="" className="test-quote-right" />

                <div className="test-review-box">
                  <figure><img src="/assets/images/rating-stars.png" alt="rating" /></figure>
                  <p>{items[activeIndex]?.text || items[activeIndex]?.testimonial || ''}</p>
                </div>

                <div className="test-indicators">
                  {items.map((t, i) => (
                    <button
                      key={t._id || i}
                      className={'test-indicator' + (activeIndex === i ? ' active' : '')}
                      onClick={() => setActiveIndex(i)}
                    >
                      <figure><img src={getImg(t.image || t.img)} alt={t.name} /></figure>
                      <div>
                        <p className="test-client-name">{t.name}</p>
                        <span>{t.role || ''}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="test-nav">
                  <button className="test-nav-btn" onClick={prev}><i className="fa-solid fa-arrow-left" /></button>
                  <button className="test-nav-btn" onClick={next}><i className="fa-solid fa-arrow-right" /></button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* BLOG POSTS */}
        <div className="test-blog-section">
          <div className="test-blog-header">
            <span className="test-special">News & Articles</span>
            <h2>Our Latest Blog Posts</h2>
          </div>
          <div className="test-blog-grid">
            {(blogPosts.length > 0 ? blogPosts : [
              { img: '/assets/images/news-and-articles-img1.jpg', title: 'Loading...', desc: '', slug: '#' },
            ]).map((post, i) => (
              <div key={post._id || i} className="test-blog-card">
                <div className="test-blog-img">
                  <figure><img src={getBlogImg(post.image)} alt={post.title} /></figure>
                </div>
                <div className="test-blog-body">
                  <Link to={`/blog/${post.slug || post._id || '#'}`}><h4>{post.title}</h4></Link>
                  <p>{post.excerpt || post.content?.slice(0, 120) || post.desc || ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Testimonials
