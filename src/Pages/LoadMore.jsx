import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import API from "../utils/api"

function LoadMore() {
  const [blogs, setBlogs] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    API.get(`/blogs?page=1&limit=3`)
      .then(({ data }) => {
        setBlogs(data.blogs || [])
        setTotalPages(data.pages || 1)
        setPage(1)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const loadMore = () => {
    const nextPage = page + 1
    API.get(`/blogs?page=${nextPage}&limit=3`)
      .then(({ data }) => {
        setBlogs(prev => [...prev, ...(data.blogs || [])])
        setTotalPages(data.pages || 1)
        setPage(nextPage)
      })
      .catch(() => {})
  }

  const getImg = (img) => {
    if (!img) return '/assets/images/standard_post_img01.jpg'
    if (img.startsWith('/uploads')) return `${import.meta.env.VITE_API_URL}${img}`
    return img
  }

  if (loading) {
    return (
      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 sub-banner-con position-relative d-flex align-items-center justify-content-center br-30">
          <div className="main-container">
            <div className="col-xl-12 col-lg-12 mr-auto ml-auto">
              <div className="sub-banner-inner-con text-center">
                <h1>Load More</h1>
                <p>Trusted source for prescription and over-the-counter medicines — delivered with care and confidence.</p>
                <div className="breadcrumb-con d-inline-block">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active">Load More</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 32, marginBottom: 12 }} />
          <p>Loading blogs...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="home_banner_outer float-left w-100 main-box position-relative">
        <div className="padding-rl float-left w-100">
          <section className="float-left w-100 sub-banner-con position-relative d-flex align-items-center justify-content-center br-30">
            <div className="main-container">
              <div className="col-xl-12 col-lg-12 mr-auto ml-auto">
                <div className="sub-banner-inner-con text-center">
                  <h1>Load More</h1>
                  <p>Trusted source for prescription and over-the-counter medicines — delivered <br />with care and confidence.</p>
                  <div className="breadcrumb-con d-inline-block">
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                      <li className="breadcrumb-item active">Load More</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div className="blog-posts blogpage-section loadblog-section float-left w-100">
        <div className="container">
          <div className="row">
            <div id="blog" className="col-xl-12">
              <div className="row">
                {blogs.map((post) => (
                  <div key={post._id} className="col-xl-4 col-lg-4">
                    <div className="blog-box load-blog float-left w-100 post-item mb-4 hide-blog">
                      <div className="post-item-wrap position-relative">
                        <div className="post-image">
                          <Link to={`/blog/${post.slug || post._id}`}>
                            <img alt={post.title} src={getImg(post.image)} loading="lazy" />
                          </Link>
                        </div>
                        <div className="lower-portion">
                          <div className="span-i-con">
                            <i className="fas fa-user"></i>
                            <span className="text-size-14 text-mr">By : {post.author || 'Admin'}</span>
                            {post.category && post.category !== 'All' && (
                              <>
                                <i className="fas fa-tag"></i>
                                <span className="text-size-14">{post.category}</span>
                              </>
                            )}
                          </div>
                          <Link to={`/blog/${post.slug || post._id}`}>
                            <h5>{post.title}</h5>
                          </Link>
                        </div>
                        <div className="button-portion loadone_twocol">
                          <div className="date">
                            <i className="fas fa-calendar-alt"></i>
                            <span className="mb-0 text-size-14">
                              {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                            </span>
                          </div>
                          <div className="button">
                            <Link className="mb-0 read_more text-decoration-none" to={`/blog/${post.slug || post._id}`}>Read More</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {page < totalPages && (
                <div className="load-more d-inline-block m-auto align-top" style={{ display: 'block', textAlign: 'center', width: '100%', marginTop: 20 }}>
                  <button className="default-btn hover-effect" onClick={loadMore} style={{ border: 'none', cursor: 'pointer' }}>
                    Load More
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoadMore
