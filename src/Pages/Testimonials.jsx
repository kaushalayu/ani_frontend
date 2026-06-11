import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Testimonials.css'

const testimonials = [
  {
    text: 'Beatae vitae dicta sunt explicabo nemo enim ipsam voluptatem quia voluptas aspernatur aurodit aut fugit, sed neatae vitae dicta ripiscing elit, sed do euismod tempor incidunt labore are dolore magna aliqua aut enim a minim adipiscing elit, sed do euismod tempor incidunt labore minima veniam.',
    name: 'Jennifer Troyer',
    role: 'Administrator',
    img: '/assets/images/client-img1.jpg',
  },
  {
    text: 'Beatae vitae dicta sunt explicabo nemo enim ipsam voluptatem quia voluptas aspernatur aurodit aut fugit, sed neatae vitae dicta ripiscing elit, sed do euismod tempor incidunt labore are dolore magna aliqua aut enim a minim adipiscing elit, sed do euismod tempor incidunt labore minima veniam.',
    name: 'Fergus Douchebag',
    role: 'Happy Customer',
    img: '/assets/images/client-img2.jpg',
  },
  {
    text: 'Beatae vitae dicta sunt explicabo nemo enim ipsam voluptatem quia voluptas aspernatur aurodit aut fugit, sed neatae vitae dicta ripiscing elit, sed do euismod tempor incidunt labore are dolore magna aliqua aut enim a minim adipiscing elit, sed do euismod tempor incidunt labore minima veniam.',
    name: 'lucy Smith',
    role: 'Satisfied Customer',
    img: '/assets/images/client-img3.jpg',
  },
  {
    text: 'Beatae vitae dicta sunt explicabo nemo enim ipsam voluptatem quia voluptas aspernatur aurodit aut fugit, sed neatae vitae dicta ripiscing elit, sed do euismod tempor incidunt labore are dolore magna aliqua aut enim a minim adipiscing elit, sed do euismod tempor incidunt labore minima veniam.',
    name: 'John Smith',
    role: 'Satisfied Client',
    img: '/assets/images/client-img4.jpg',
  },
]

function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)

  const prev = () => setActiveIndex(i => (i === 0 ? testimonials.length - 1 : i - 1))
  const next = () => setActiveIndex(i => (i === testimonials.length - 1 ? 0 : i + 1))

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

          <div className="test-carousel-body">
            <img src="/assets/images/left-quote.png" alt="" className="test-quote-left" />
            <img src="/assets/images/right-quote.png" alt="" className="test-quote-right" />

            <div className="test-review-box">
              <figure><img src="/assets/images/rating-stars.png" alt="rating" /></figure>
              <p>{testimonials[activeIndex].text}</p>
            </div>

            <div className="test-indicators">
              {testimonials.map((t, i) => (
                <button
                  key={i}
                  className={'test-indicator' + (activeIndex === i ? ' active' : '')}
                  onClick={() => setActiveIndex(i)}
                >
                  <figure><img src={t.img} alt={t.name} /></figure>
                  <div>
                    <p className="test-client-name">{t.name}</p>
                    <span>{t.role}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="test-nav">
              <button className="test-nav-btn" onClick={prev}><i className="fa-solid fa-arrow-left" /></button>
              <button className="test-nav-btn" onClick={next}><i className="fa-solid fa-arrow-right" /></button>
            </div>
          </div>
        </div>

        {/* BLOG POSTS */}
        <div className="test-blog-section">
          <div className="test-blog-header">
            <span className="test-special">News & Articles</span>
            <h2>Our Latest Blog Posts</h2>
          </div>
          <div className="test-blog-grid">
            {[
              { img: '/assets/images/news-and-articles-img1.jpg', title: '5 Natural Ways to Strengthen Your Immune System', desc: 'Discover simple lifestyle habits and key supplements that can naturally boost your immunity...' },
              { img: '/assets/images/news-and-articles-img2.jpg', title: 'Skincare Advice for Sensitive Skin: Simple Tips for a Calmer', desc: 'Learn how to care for sensitive skin with gentle routines and dermatologist-recommended products.' },
              { img: '/assets/images/news-and-articles-img3.jpg', title: 'Do You Really Need Supplements? a Practical Guide to Boosting', desc: 'Find out when supplements are helpful and how to choose the right ones for your health needs.' },
            ].map((post, i) => (
              <div key={i} className="test-blog-card">
                <div className="test-blog-img">
                  <figure><img src={post.img} alt={post.title} /></figure>
                </div>
                <div className="test-blog-body">
                  <Link to="/blog"><h4>{post.title}</h4></Link>
                  <p>{post.desc}</p>
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
