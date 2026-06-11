import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../utils/api'

function Blog() {
  const [activeTab, setActiveTab] = useState('All')
  const [blogs, setBlogs] = useState([])
  const [categories, setCategories] = useState(['All'])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const LIMIT = 9

  // Fetch categories once
  useEffect(() => {
    API.get('/blogs/categories')
      .then(({ data }) => {
        if (data.success) setCategories(data.categories)
      })
      .catch(() => {})
  }, [])

  // Fetch blogs on tab/page change
  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ page, limit: LIMIT })
    if (activeTab !== 'All') params.append('category', activeTab)

    API.get(`/blogs?${params}`)
      .then(({ data }) => {
        if (data.success) {
          setBlogs(data.blogs)
          setTotalPages(data.pages)
          setTotal(data.total)
        }
      })
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false))
  }, [activeTab, page])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setPage(1)
  }

  const imgSrc = (img) => {
    if (!img) return '/assets/images/single-blog-tab-img1.jpg'
    if (img.startsWith('/uploads')) return `http://localhost:5000${img}`
    if (img.startsWith('http')) return img
    return `/assets/images/${img}`
  }

  return (
    <>
      {/* Sub Banner */}
      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 sub-banner-con position-relative d-flex align-items-center justify-content-center br-30">
          <div className="main-container">
            <div className="col-xl-12 col-lg-12 mr-auto ml-auto">
              <div className="sub-banner-inner-con text-center">
                <h1>Blog</h1>
                <p>Trusted source for prescription and over-the-counter medicines — delivered <br />with care and confidence.</p>
                <div className="breadcrumb-con d-inline-block">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Blog</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Blog Tabs */}
      <div className="blog-tabs-section padding-top padding-bottom float-left w-100">
        <div className="container">
          <div className="blog-tabs-inner-section">

            {/* Category Tabs */}
            <ul className="nav nav-tabs">
              {categories.map((tab) => (
                <li key={tab} className="nav-item">
                  <span
                    className={`nav-link${activeTab === tab ? ' active' : ''}`}
                    onClick={() => handleTabChange(tab)}
                    style={{ cursor: 'pointer' }}
                  >
                    {tab}
                  </span>
                </li>
              ))}
            </ul>

            {/* Blog Posts */}
            <div className="tab-content">
              <div className="tab-pane fade show active">
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
                    <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 32 }} />
                    <p style={{ marginTop: 12 }}>Loading blogs...</p>
                  </div>
                ) : blogs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
                    <i className="fa-regular fa-newspaper" style={{ fontSize: 40, marginBottom: 12 }} />
                    <p>No blog posts found in this category.</p>
                    <p style={{ fontSize: 13, marginTop: 6 }}>Admin can add blog posts from the admin panel.</p>
                  </div>
                ) : (
                  <div className="single-blog-outer-con">
                    {blogs.map((post) => (
                      <div key={post._id} className="single-blog-box">
                        <figure className="mb-0">
                          <img
                            src={imgSrc(post.image)}
                            alt={post.title}
                            loading="lazy"
                            className="img-fluid"
                            style={{ width: '100%', height: 220, objectFit: 'cover' }}
                          />
                        </figure>
                        <div className="single-blog-details">
                          <ul className="list-unstyled">
                            <li className="position-relative">
                              <i className="fas fa-user" /> Posted by {post.author || 'Admin'}
                            </li>
                            <li className="position-relative">
                              <i className="fas fa-calendar-alt" />
                              {' '}{new Date(post.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric'
                              })}
                            </li>
                            <li className="position-relative">
                              <i className="fas fa-tag" /> {post.category}
                            </li>
                          </ul>
                          <h4><Link to="/blog">{post.title}</Link></h4>
                          <p>
                            {post.excerpt || post.content?.slice(0, 120)}
                            {(post.content?.length > 120) ? '...' : ''}
                          </p>
                          <div className="generic-btn2">
                            <Link to="/blog">Read More</Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav aria-label="Blog pagination">
                <ul className="pagination">
                  <li className={`page-item${page === 1 ? ' disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setPage(p => p - 1)}
                      disabled={page === 1}
                    >
                      <i className="fas fa-angle-left" />
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li key={i + 1} className={`page-item${page === i + 1 ? ' active' : ''}`}>
                      <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
                    </li>
                  ))}
                  <li className={`page-item${page === totalPages ? ' disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setPage(p => p + 1)}
                      disabled={page === totalPages}
                    >
                      <i className="fas fa-angle-right" />
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Blog
