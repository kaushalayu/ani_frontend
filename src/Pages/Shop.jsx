import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../Components/ProductCard'

function Shop() {
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [sort, setSort] = useState('')
  const [page, setPage] = useState(1)

  const { products, loading, error, total, pages } = useProducts({
    search,
    sort,
    page,
    limit: 9,
  })

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  return (
    <>
      {/* SUB BANNER */}
      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 sub-banner-con position-relative d-flex align-items-center justify-content-center br-30">
          <div className="main-container">
            <div className="col-xl-12 col-lg-12 mr-auto ml-auto">
              <div className="sub-banner-inner-con text-center">
                <h1>Shop</h1>
                <p>Our one-stop shop for prescription and OTC medicines — fast, safe, and <br />reliable delivery to your door.</p>
                <div className="breadcrumb-con d-inline-block">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Shop</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SHOP */}
      <section className="shop-con feature-con position-relative float-left w-100 padding-top padding-bottom">
        <div className="main-container">
          <div className="row">
            {/* Sidebar */}
            <div className="sidebar sticky-sidebar col-lg-3 wow fadeInLeft" data-wow-duration="2s" data-wow-delay="0.05s">
              <div className="theiaStickySidebar">
                {/* Search */}
                <div className="widget widget-newsletter" data-aos="fade-up">
                  <form onSubmit={handleSearch} className="form-inline">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control widget-search-form"
                        placeholder="Search"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                      />
                      <div className="input-group-append">
                        <span className="input-group-btn">
                          <button type="submit" className="btn"><i className="fa fa-search" /></button>
                        </span>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Categories */}
                <div className="widget widget-categories" data-aos="fade-up">
                  <div className="widget-title font_weight_600">Categories :</div>
                  <ul className="list-unstyled mb-0">
                    <li className="cat-item"><Link to="/sleeping-pills" className="d-block">Sleeping Pills</Link></li>
                    <li className="cat-item"><Link to="/painkillers" className="d-block">Painkillers</Link></li>
                    <li className="cat-item"><Link to="/anxiety" className="d-block">Anxiety Pills</Link></li>
                    <li className="cat-item"><Link to="/new-arrivals" className="d-block">New Arrivals</Link></li>
                    <li className="cat-item"><Link to="/best-sellers" className="d-block">Best Sellers</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="col-lg-9 wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.05s">
              <div className="row default-sorting-con">
                <div className="col-12">
                  <div className="top-icons" data-aos="fade-up">
                    <div className="icons-list">
                      <span>Showing {products.length} of {total} results</span>
                    </div>
                    <div id="toolbar">
                      <select
                        className="form-control"
                        value={sort}
                        onChange={(e) => { setSort(e.target.value); setPage(1) }}
                      >
                        <option value="">Default Sorting</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="rating">Top Rated</option>
                        <option value="name">Name A-Z</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="shop-box-wrapper">
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
                    <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 32, marginBottom: 12 }} />
                    <p>Loading products...</p>
                  </div>
                ) : error ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: '#e05b5b' }}>
                    <p>{error}</p>
                  </div>
                ) : products.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
                    <i className="fa-solid fa-box-open" style={{ fontSize: 40, marginBottom: 12 }} />
                    <p>No products found.</p>
                  </div>
                ) : (
                  <div className="row best-products-con" data-aos="fade-up">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} layout="grid" />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {pages > 1 && (
                  <ul className="pagination" data-aos="fade-up">
                    {page > 1 && (
                      <li className="page-item">
                        <button className="page-link" onClick={() => setPage(p => p - 1)}>
                          <i className="fas fa-angle-left" />
                        </button>
                      </li>
                    )}
                    {Array.from({ length: pages }, (_, i) => (
                      <li key={i + 1} className={`page-item${page === i + 1 ? ' active' : ''}`}>
                        <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
                      </li>
                    ))}
                    {page < pages && (
                      <li className="page-item next">
                        <button className="page-link" onClick={() => setPage(p => p + 1)}>
                          <i className="fas fa-angle-right" />
                        </button>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Shop
