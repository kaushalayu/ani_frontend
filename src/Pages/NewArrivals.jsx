import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../Components/ProductCard'
import './CategoryProducts.css'

function NewArrivals() {
  const { products, loading, error } = useProducts({ isNewArrival: true, limit: 12 })

  return (
    <div className="category-page" style={{ '--accent': '#0369a1', '--accent-light': '#0ea5e9', '--accent-lighter': '#38bdf8', '--accent-dark': '#075985' }}>
      <div className="container">
        <div className="category-banner">
          <h1>New Arrivals</h1>
          <p>Discover the latest additions to our pharmacy — fresh products now available for your health needs.</p>
          <div className="breadcrumb">
            <span className="breadcrumb-item"><Link to="/">Home</Link></span>
            <span className="breadcrumb-item active" aria-current="page">New Arrivals</span>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 32 }} />
            <p style={{ marginTop: 12 }}>Loading products...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#e05b5b' }}>{error}</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
            <p>No new arrivals yet. Admin can mark products as New Arrival from the panel.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} layout="category" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NewArrivals
