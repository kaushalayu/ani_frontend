import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
import API from '../utils/api'

function BlogDetail() {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    API.get(`/blogs/${id}`)
      .then(({ data }) => {
        if (data.success) {
          setBlog(data.blog)
          // Fetch related posts in same category
          if (data.blog?.category) {
            API.get(`/blogs?category=${encodeURIComponent(data.blog.category)}&limit=3`)
              .then(({ data: rd }) => {
                if (rd.success) {
                  setRelated(rd.blogs.filter(b => b._id !== id).slice(0, 3))
                }
              })
              .catch(() => {})
          }
        } else {
          setError('Blog post not found.')
        }
      })
      .catch(() => setError('Failed to load blog post.'))
      .finally(() => setLoading(false))
  }, [id])

  const imgSrc = (img) => {
    if (!img) return '/assets/images/single-blog-tab-img1.jpg'
    if (img.startsWith('/uploads')) return `${import.meta.env.VITE_API_URL}${img}`
    if (img.startsWith('http')) return img
    return `/assets/images/${img}`
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', color: '#888' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 36 }} />
        <p style={{ marginTop: 16 }}>Loading post...</p>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', color: '#888' }}>
        <i className="fa-regular fa-newspaper" style={{ fontSize: 40, marginBottom: 12 }} />
        <p>{error || 'Blog post not found.'}</p>
        <Link to="/blog" style={{ color: '#0f766e', fontWeight: 600 }}>← Back to Blog</Link>
      </div>
    )
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
                <p>Trusted source for health tips, medicines, and wellness insights.</p>
                <div className="breadcrumb-con d-inline-block">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/blog">Blog</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Post</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Blog Detail Content */}
      <div className="padding-rl float-left w-100" style={{ paddingTop: 60, paddingBottom: 80 }}>
        <div className="container">
          <div className="row">
            {/* Main Content */}
            <div className="col-lg-8">
              <article className="blog-detail-article">
                {/* Featured Image */}
                <figure style={{ marginBottom: 28, borderRadius: 12, overflow: 'hidden' }}>
                  <img
                    src={imgSrc(blog.image)}
                    alt={blog.title}
                    className="img-fluid"
                    style={{ width: '100%', maxHeight: 420, objectFit: 'cover' }}
                  />
                </figure>

                {/* Meta */}
                <div className="blog-meta" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 20, color: '#6b7280', fontSize: 14 }}>
                  <span><i className="fas fa-user" style={{ marginRight: 6 }} />{blog.author || 'Admin'}</span>
                  <span>
                    <i className="fas fa-calendar-alt" style={{ marginRight: 6 }} />
                    {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  {blog.category && (
                    <span>
                      <i className="fas fa-tag" style={{ marginRight: 6 }} />
                      {blog.category}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 20, lineHeight: 1.4 }}>
                  {blog.title}
                </h1>

                {/* Excerpt */}
                {blog.excerpt && (
                  <p style={{ fontSize: 17, color: '#4b5563', fontStyle: 'italic', borderLeft: '4px solid #0f766e', paddingLeft: 16, marginBottom: 24 }}>
                    {blog.excerpt}
                  </p>
                )}

                {/* Full Content */}
                <div
                  className="blog-detail-content"
                  style={{ fontSize: 16, lineHeight: 1.8, color: '#374151' }}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content || blog.excerpt || '') }}
                />

                {/* Back link */}
                <div style={{ marginTop: 40 }}>
                  <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#0f766e', fontWeight: 600, fontSize: 15 }}>
                    <i className="fa-solid fa-arrow-left" /> Back to All Posts
                  </Link>
                </div>
              </article>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div style={{ background: '#f9fafb', borderRadius: 12, padding: 24, marginBottom: 28 }}>
                <h5 style={{ fontWeight: 700, marginBottom: 16, color: '#111827' }}>About This Post</h5>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 14, color: '#6b7280' }}>
                  <li style={{ marginBottom: 10 }}><strong>Author:</strong> {blog.author || 'Admin'}</li>
                  <li style={{ marginBottom: 10 }}>
                    <strong>Published:</strong>{' '}
                    {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </li>
                  {blog.category && <li><strong>Category:</strong> {blog.category}</li>}
                </ul>
              </div>

              {related.length > 0 && (
                <div>
                  <h5 style={{ fontWeight: 700, marginBottom: 16, color: '#111827' }}>Related Posts</h5>
                  {related.map(post => (
                    <Link
                      key={post._id}
                      to={`/blog/${post._id}`}
                      style={{ display: 'flex', gap: 12, marginBottom: 16, textDecoration: 'none' }}
                    >
                      <img
                        src={imgSrc(post.image)}
                        alt={post.title}
                        style={{ width: 70, height: 60, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                      />
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0, lineHeight: 1.4 }}>{post.title}</p>
                        <span style={{ fontSize: 12, color: '#9ca3af' }}>
                          {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BlogDetail
